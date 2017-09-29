import { UI_ACTIONS } from '../constants';

const DEFAULT_STATE = {
  updateButtonEnabled: true,
};

export default function uiReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case UI_ACTIONS.toggleUpdateButton:
      return { ...state, updateButtonEnabled: !state.updateButtonEnabled };
    default:
      return state;
  }
}
