import { get } from 'lodash';
import { FRITZ_ACTIONS } from '../constants';
import { promiseHelpers } from '../utils';

const CONSTANTS = promiseHelpers.getPendingSymbols(FRITZ_ACTIONS);

const DEFAULT_STATE = {
  error: null,
  token: null,
};

function resetTokenOnUnauthorized(state, action) {
  if (get(action, 'payload.error.name') === 'UnauthorizedError') {
    return { ...state, token: DEFAULT_STATE.token };
  }
  return state;
}

export default function fritzReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case CONSTANTS.resetToken.$symbol:
      return DEFAULT_STATE;
    case CONSTANTS.getToken.fulfilled:
      return { ...state, token: action.payload.response };
    case CONSTANTS.getToken.rejected:
    case CONSTANTS.getData.rejected:
      return resetTokenOnUnauthorized(state, action);
    case CONSTANTS.setError.$symbol:
      return { error: action.payload, token: null };
    default:
      return state;
  }
}
