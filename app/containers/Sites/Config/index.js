import React, { Component } from 'react';
import { noop } from 'lodash';

import Layout from '../../Layout';
import ConfigForm from '../../ConfigForm';
import styles from './styles.scss';

class Config extends Component {
  render() {
    return (
      <Layout buttonLink="/" buttonIcon="home">
        <div className={`window-content window-content--flex-inner ${styles.wrapper}`}>
          <ConfigForm onSubmit={noop} />
        </div>
      </Layout>
    );
  }
}

export default Config;
