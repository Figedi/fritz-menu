import { CONFIG_ACTIONS } from '../constants';

const INITAL_STATE = {
  startup: false,
  ip: process.env.FRITZBOX_HOST,
  username: process.env.FRITZBOX_USERNAME,
  password: process.env.FRITZBOX_PASSWORD,
};

function setFormField(state, action) {
  const { field, value } = action.payload;
  return { ...state, [field]: value };
}

function toggleFormField(state, action) {
  const { field } = action.payload;
  const old = state[field];

  return { ...state, [field]: !old };
}

function commitForm(state, action) {
  const { payload: { ip, startup, username, password } } = action;
  return {
    ...state,
    ip,
    startup,
    username,
    password,
  };
}

export default function configReducer(state = INITAL_STATE, action) {
  if (action.type === CONFIG_ACTIONS.setFormField) {
    return setFormField(state, action);
  } else if (action.type === CONFIG_ACTIONS.toggleFormField) {
    return toggleFormField(state, action);
  } else if (action.type === CONFIG_ACTIONS.commitForm) {
    return commitForm(state, action);
  }
  return state;
}
