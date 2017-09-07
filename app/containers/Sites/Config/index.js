import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { connect } from 'react-redux';

import Layout from '../../Layout';
import ConfigForm from '../../ConfigForm';
import styles from './styles.scss';
import { OSSelector } from '../../../selectors';
import * as mapDispatchToProps from '../../../actions/fritz';

const mapStateToProps = state => ({
  OS: OSSelector(state),
});

class Config extends PureComponent {
  static propTypes = {
    OS: PropTypes.string,
    getOS: PropTypes.func.isRequired,
  };

  static defaultProps = {
    OS: null,
  };

  componentDidMount() {
    const { OS, getOS } = this.props;
    if (!OS) {
      getOS();
    }
  }

  render() {
    const { OS } = this.props;
    return (
      <Layout buttonLink="/" buttonIcon="home">
        <div className={`window-content window-content--flex-inner ${styles.wrapper}`}>
          {OS &&
            <div className={styles.info}>
              <p>
                Connected Fritzbox@{OS}
              </p>
            </div>}
          <ConfigForm onSubmit={noop} />
        </div>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Config);
