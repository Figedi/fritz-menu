import { get } from 'lodash';
import { FRITZ_ACTIONS } from '../constants';
import { promiseHelpers } from '../utils';

const CONSTANTS = promiseHelpers.getPendingSymbols(FRITZ_ACTIONS);

const DEFAULT_STATE = {
  error: null,
  tokenObj: {
    token: null,
    tokenAt: null,
  },
  meta: {
    OS: null,
  },
};

function resetTokenOnUnauthorized(state, action) {
  if (get(action, 'payload.error.name') === 'UnauthorizedError') {
    return { ...state, tokenObj: DEFAULT_STATE.tokenObj };
  }
  return state;
}

export default function fritzReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case CONSTANTS.resetToken.$symbol:
      return DEFAULT_STATE;
    case CONSTANTS.getData.fulfilled:
      return { ...state, error: null };
    case CONSTANTS.getToken.fulfilled:
      return { ...state, error: null, tokenObj: action.payload.response };
    case CONSTANTS.getOS.fulfilled:
      return { ...state, error: null, meta: { ...state.meta, OS: action.payload.response } };
    case CONSTANTS.getOS.rejected:
      return resetTokenOnUnauthorized(
        { ...state, error: null, meta: { ...state.meta, OS: null } },
        action,
      );
    case CONSTANTS.getToken.rejected:
    case CONSTANTS.getData.rejected:
      return resetTokenOnUnauthorized(state, action);
    case CONSTANTS.setError.$symbol:
      return { ...state, error: action.payload, tokenObj: null };
    default:
      return state;
  }
}
