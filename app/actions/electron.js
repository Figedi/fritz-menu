/* eslint-disable import/prefer-default-export */

import { electron } from '../api';

export function quit() {
  return () => {
    electron.quit();
  };
}
