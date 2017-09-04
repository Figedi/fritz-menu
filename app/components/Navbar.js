import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Toolbar } from 'react-photonkit';

const Navbar = ({ to, icon }) =>
  (<Toolbar ptType="header" title="Fritzbox-Stats">
    <div className="toolbar-actions">
      <Link to={to}>
        <button className="btn btn-default pull-right">
          <span className={`fa fa-${icon}`} />
        </button>
      </Link>
    </div>
  </Toolbar>);

Navbar.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Navbar;
