import { CONFIG_ACTIONS } from '../constants';

export function setFormField(field, value) {
  return {
    type: CONFIG_ACTIONS.setFormField,
    payload: {
      field,
      value,
    },
  };
}

export function commitForm(formData) {
  return {
    type: CONFIG_ACTIONS.commitForm,
    payload: formData,
  };
}
