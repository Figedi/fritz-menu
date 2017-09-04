import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const ErrorComponent = ({ error: { name, message, ...remainingError }, wrapperClassName }) => {
  let errorMessage;
  let recoverable = true;
  switch (name) {
    case 'SIDError':
      errorMessage = 'Could not authenticate, please try other credentials';
      recoverable = false;
      break;
    case 'FetchError':
      if (remainingError.code === 'ENOTFOUND') {
        errorMessage =
          'Invalid Address, please try other IP/DNS Address or check network environment (Are you connected to a VPN?)';
        recoverable = false;
      } else {
        errorMessage = 'Unknown FetchError, stopping';
      }
      break;
    default:
      errorMessage = message;
  }

  return (
    <div className={wrapperClassName}>
      <i className="fa fa-2x fa-times" />
      <h5>Error</h5>
      <p className={styles.errorMessage}>
        {errorMessage}
      </p>
      {recoverable &&
        <button className="btn btn-positive" onClick={this.restartInterval}>
          Recheck
        </button>}
    </div>
  );
};

ErrorComponent.propTypes = {
  error: PropTypes.shape({
    name: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  wrapperClassName: PropTypes.string,
};

ErrorComponent.defaultProps = {
  wrapperClassName: null,
};

export default ErrorComponent;
