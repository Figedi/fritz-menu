import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as mapDispatchToProps from '../actions/electron';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ buttonLink, buttonIcon, children, quit }) =>
  (<div className="window window--flex">
    <Navbar to={buttonLink} icon={buttonIcon} />
    {children}
    <Footer onQuit={quit} />
  </div>);

Layout.propTypes = {
  quit: PropTypes.func.isRequired,
  buttonLink: PropTypes.string.isRequired,
  buttonIcon: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default connect(null, mapDispatchToProps)(Layout);
