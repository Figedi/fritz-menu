import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from 'react-photonkit';

const Footer = ({ onQuit }) =>
  (<Toolbar ptType="footer">
    <div className="toolbar-actions">
      <button onClick={onQuit} className="btn btn-primary pull-right">
        Close
      </button>
    </div>
  </Toolbar>);

Footer.propTypes = {
  onQuit: PropTypes.func.isRequired,
};

export default Footer;
