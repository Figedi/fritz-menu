/* eslint-disable import/prefer-default-export */

import { UI_ACTIONS } from '../constants';

export function toggleUpdateButton() {
  return {
    type: UI_ACTIONS.toggleUpdateButton,
  };
}
