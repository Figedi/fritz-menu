import React from 'react';
import PropTypes from 'prop-types';

const InfoComponent = ({ message, wrapperClassName }) =>
  (<div className={wrapperClassName}>
    <i className="fa fa-2x fa-fw fa-spin fa-refresh" />
    <p>
      {message}
    </p>
  </div>);

InfoComponent.propTypes = {
  message: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
};

InfoComponent.defaultProps = {
  wrapperClassName: null,
};

export default InfoComponent;
