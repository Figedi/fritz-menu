import { call, select, take, fork, put, cancel, actionChannel, all } from 'redux-saga/effects';
import { buffers, delay } from 'redux-saga';
import { REHYDRATE } from 'redux-persist/constants';
import { get } from 'lodash';

import { fritz as fritzApi } from '../api';
import { FRITZ_ACTIONS } from '../constants';
import { fritz } from '../actions';
import { promiseHelpers } from '../utils';
import { getToken, getTokenObj, getRehydrateTimeout, getConfig } from '../selectors';

const CONSTANTS = promiseHelpers.getPendingSymbols(FRITZ_ACTIONS);

const MAX_ERRORS = 3;

let fritzChannel;

function* rehydrate() {
  const token = yield select(getToken);
  // without a token, we assume we need to refetch it first
  if (!token) {
    yield put(fritz.getToken());
  }
  // regular schedule of get-data when token is present
  yield put(fritz.getData());
}

function* startRehydrateInterval() {
  const rehydrateTimeout = yield select(getRehydrateTimeout);
  while (true) {
    const token = yield select(getToken);
    yield call(rehydrate, token);
    yield call(delay, rehydrateTimeout);
  }
}

/**
 * Instead of putting the payload directly into the action, we defer it up until
 * actually executing the api-fn. This allows as to always fetch the current state
 * while the intention to execute the fn is queued indefinitely.
 *
 * Usecase: Schedule a token retrieval, then a graph-data retrieval which directly
 * depends on the token retrieval's response (and thus the store's state).
 *
 * @method applyActionPayload
 * @param  {String}           type   The action-type
 * @return {Array<any>}              Returns the arguments or empty array
 */
function* applyActionPayload(type) {
  switch (type) {
    // standard getter just need the current token / credentials
    case CONSTANTS.getData.$symbol:
    case CONSTANTS.getOS.$symbol: {
      const { tokenObj, config: { ip, username, password } } = yield all({
        config: select(getConfig),
        tokenObj: select(getTokenObj),
      });
      return [{ base: ip, username, password }, tokenObj];
    }
    // getToken needs the credentials
    case CONSTANTS.getToken.$symbol: {
      const { ip, username, password } = yield select(getConfig);
      return [{ base: ip, username, password }];
    }
    // empty payload for other actions
    default:
      return [];
  }
}

function* handleRequest({ payload, ...action }, tryRearm = true) {
  if (!payload) {
    return {};
  }
  const { method } = payload;
  const { type } = action;
  if (!method) {
    return {};
  }
  yield put({ type: CONSTANTS[method].pending, payload });

  try {
    const args = yield call(applyActionPayload, type);
    const response = yield call(fritzApi[method], ...args);
    yield put({ type: CONSTANTS[method].fulfilled, payload: { ...payload, response } });
    return response;
  } catch (error) {
    // when the action was unauthorized, try to rearm, then replay request once
    if (error.name === 'UnauthorizedError' && tryRearm) {
      console.info(`UnauthorizedError@${method}, trying to rearm, then replay this action`);
      yield put(fritz.resetToken());
      try {
        // first re-get the token
        const args = yield call(applyActionPayload, CONSTANTS.getToken.$symbol);
        const response = yield call(fritzApi.getToken, ...args);
        yield put({ type: CONSTANTS.getToken.fulfilled, payload: { response } });
        // then replay the request
        return yield call(handleRequest, { payload, ...action }, false);
      } catch (e) {
        return { error: e };
      }
    } else {
      yield put({ type: CONSTANTS[method].rejected, payload: { ...payload, error } });
      return { error };
    }
  }
}

// =============================================================================
// Watchers
// =============================================================================

function* watchRequests() {
  fritzChannel = yield actionChannel(
    [CONSTANTS.getToken.$symbol, CONSTANTS.getData.$symbol, CONSTANTS.getOS.$symbol],
    buffers.sliding(5),
  );
  let errors = 0;
  let lastError;
  while (errors < MAX_ERRORS) {
    // 2- take from the channel
    const action = yield take(fritzChannel);
    // 3- Note that we're using a blocking call
    const { error } = yield call(handleRequest, action);
    if (error) {
      errors += 1;
      lastError = error;
    } else {
      // reset errors upon first successful request
      errors = 0;
    }
  }
  yield put(fritz.setError(lastError)); // too many errors, emit error + clear channel afterwards
}

function* rehydrateStart() {
  while (true) {
    yield take(CONSTANTS.startInterval.$symbol);
    // start with fresh request watcher and start rehydrating periodically
    const rehydrateTask = yield fork(startRehydrateInterval);
    yield take([CONSTANTS.setError.$symbol, CONSTANTS.stopInterval.$symbol]);
    yield cancel(rehydrateTask);
  }
}

function* watchRehydrate() {
  const action = yield take(REHYDRATE);
  if (get(action, 'payload.fritz.token')) {
    yield fork(rehydrate);
  }
}

export default function* root() {
  yield all([call(watchRehydrate), call(watchRequests), call(rehydrateStart)]);
}
