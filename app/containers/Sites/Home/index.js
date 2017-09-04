import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import Layout from '../../Layout';
import { Chart, ErrorComponent, InfoComponent } from '../../../components';
import * as mapDispatchToProps from '../../../actions/fritz';
import {
  getError,
  getDownstreamData,
  getUpstreamData,
  hasGraphDataSelector,
  shouldOpenModalSelector,
} from '../../../selectors';
import styles from './styles.scss';

function mapStateToProps(state) {
  return {
    downstream: getDownstreamData(state),
    upstream: getUpstreamData(state),
    error: getError(state),
    hasGraphData: hasGraphDataSelector(state),
    shouldOpenModal: shouldOpenModalSelector(state),
  };
}

class Home extends Component {
  static propTypes = {
    startInterval: PropTypes.func.isRequired,
    stopInterval: PropTypes.func.isRequired,
    hasGraphData: PropTypes.bool.isRequired,
    shouldOpenModal: PropTypes.bool.isRequired,
    error: PropTypes.shape({
      name: PropTypes.string,
      message: PropTypes.string,
    }),
    downstream: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          series: PropTypes.arrayOf(
            PropTypes.shape({
              x: PropTypes.number,
              y: PropTypes.number,
            }),
          ),
          id: PropTypes.string,
        }),
      ),
      max: PropTypes.number.isRequired,
    }).isRequired,
    upstream: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          series: PropTypes.arrayOf(
            PropTypes.shape({
              x: PropTypes.number,
              y: PropTypes.number,
            }),
          ),
          id: PropTypes.string,
        }),
      ),
      max: PropTypes.number.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    error: null,
    token: null,
  };

  componentDidMount() {
    this.props.startInterval();
  }

  componentWillUnmount() {
    this.props.stopInterval();
  }

  restartInterval = () => {
    this.props.stopInterval();
    this.props.startInterval();
  };

  renderModalContent() {
    const { error } = this.props;
    if (error) {
      return <ErrorComponent error={error} wrapperClassName={styles.modalContent} />;
    }
    // its either an error, or no token and no graphdata (implicitly from shouldOpenModal)
    return (
      <InfoComponent
        message="Fetching token & data, please wait"
        wrapperClassName={styles.modalContent}
      />
    );
  }

  render() {
    const { downstream, upstream, hasGraphData, shouldOpenModal } = this.props;
    return (
      <Layout buttonLink="/config" buttonIcon="cog">
        <div className="window-content window-content--flex-inner">
          <Modal
            isOpen={shouldOpenModal}
            contentLabel="Error fetching data :("
            className={styles.modal}
            overlayClassName={styles.overlay}
          >
            {this.renderModalContent()}
          </Modal>
          {hasGraphData && <Chart data={downstream} title="Downstream" />}
          {hasGraphData && <Chart data={upstream} title="Upstream" />}
        </div>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
