import { FRITZ_ACTIONS } from '../constants';

export function resetData() {
  return { type: FRITZ_ACTIONS.resetData };
}

export function resetToken() {
  return { type: FRITZ_ACTIONS.resetToken };
}

export function startInterval() {
  return { type: FRITZ_ACTIONS.startInterval };
}

export function stopInterval() {
  return { type: FRITZ_ACTIONS.stopInterval };
}

export function setError(error) {
  return { type: FRITZ_ACTIONS.setError, error: true, payload: error };
}

export function getToken() {
  return {
    type: FRITZ_ACTIONS.getToken,
    payload: { method: 'getToken' },
  };
}

export function getData() {
  return { type: FRITZ_ACTIONS.getData, payload: { method: 'getData' } };
}
