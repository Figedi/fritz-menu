import { some } from 'lodash';
import { call, select, take, put, all } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { actionTypes, formValueSelector } from 'redux-form';
import { push } from 'react-router-redux';

import { config, fritz } from '../actions';
import { enable, disable, getState } from '../api/startup';
import { getConfig } from '../selectors';

const selector = formValueSelector('config');
const getNewConfig = state => selector(state, 'ip', 'startup', 'username', 'password');

// returns true when any of the given props in newData differ from oldData
const changed = (oldData, newData, ...props) =>
  some(props, prop => oldData[prop] !== newData[prop]);

function* checkConfig(oldData, newData) {
  if (changed(oldData, newData, 'ip', 'username', 'password')) {
    yield put(fritz.resetToken());
    yield put(fritz.resetData());
  }
}

function* checkStartup(oldData, newData) {
  if (newData.startup) {
    yield call(enable);
  } else {
    yield call(disable);
  }
}

function* watchConfigChange() {
  while (true) {
    const { meta: { form } } = yield take(actionTypes.SET_SUBMIT_SUCCEEDED);
    if (form === 'config') {
      const newPayload = yield select(getNewConfig);
      const oldPayload = yield select(getConfig);
      yield all([checkConfig, checkStartup].map(fn => call(fn, oldPayload, newPayload)));
      yield put(config.commitForm(newPayload));
      yield put(push('/'));
    }
  }
}

function* watchRehydrate() {
  yield take(REHYDRATE);
  const startupState = yield call(getState);
  yield put(config.setFormField('startup', startupState));
}

export default function* root() {
  yield all([call(watchConfigChange), call(watchRehydrate)]);
}
