import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styles from './styles.scss';

import { electron } from '../../actions';

function mapStateToProps(state) {
  return {
    initialValues: state.config,
  };
}

const mapDispatchToProps = dispatch => ({
  checkForUpdates: () => dispatch(electron.checkForUpdates()),
  back: () => dispatch(push('/')),
});

const validate = values => {
  const errors = {};
  if (!values.ip) {
    errors.ip = 'Required';
  }
  return errors;
};

/* eslint-disable react/prop-types */
const renderField = ({ input, placeholder, label, type, meta: { touched, error, warning } }) => (
  <div className="form-group">
    <label htmlFor={input.name}>{label}</label>
    <input {...input} placeholder={placeholder || label} type={type} className="form-control" />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

/* eslint-enable react/prop-types */

const ConfigForm = ({ handleSubmit, checkForUpdates, back, pristine, submitting }) => (
  <form className={styles.form} onSubmit={handleSubmit}>
    <div>
      <Field
        name="ip"
        component={renderField}
        type="text"
        label="IP/DNS-Address"
        placeholder="Enter your router's IP/DNS"
      />
      <Field
        name="username"
        component={renderField}
        type="text"
        label="Username"
        placeholder="Enter your router-user"
      />
      <Field
        name="password"
        component={renderField}
        type="password"
        label="Password"
        placeholder="Enter your router-password"
      />
      <div className="checkbox">
        <label htmlFor="startup">
          <Field name="startup" component="input" type="checkbox" className="form-control" /> Run at
          startup
        </label>
      </div>
    </div>
    <div className={styles.buttonRow}>
      <button className="btn btn-default" type="button" onClick={back}>
        Abort
      </button>
      {process.env.NODE_ENV === 'production' && (
        <button type="button" className="btn btn-default" onClick={checkForUpdates}>
          Check For updates
        </button>
      )}

      <button className="btn btn-positive" disabled={pristine || submitting} type="submit">
        Save
      </button>
    </div>
  </form>
);

ConfigForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  back: PropTypes.func.isRequired,
  checkForUpdates: PropTypes.func.isRequired,
};

const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'config',
    validate,
  }),
);

export default enhancer(ConfigForm);
