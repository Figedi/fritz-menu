/* eslint-disable import/prefer-default-export */

import { electron } from '../api';
import { ELECTRON_ACTIONS } from '../constants';

export function quit() {
  return () => {
    electron.quit();
  };
}

export function checkForUpdates() {
  return {
    type: ELECTRON_ACTIONS.checkForUpdates,
  };
}
