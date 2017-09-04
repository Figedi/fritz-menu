import React from 'react';
import PropTypes from 'prop-types';

export default class Bootloader extends React.PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
    // basic store stuff, ignore other props
    persistor: PropTypes.shape({
      subscribe: PropTypes.func,
    }).isRequired,
  };

  state = {
    ready: false,
  };

  componentDidMount() {
    const { persistor } = this.props;
    this.unsubscribeFromPersistorUpdates = persistor.subscribe(() => {
      this.setState({ ready: true });
      if (this.unsubscribeFromPersistorUpdates) {
        this.unsubscribeFromPersistorUpdates();
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFromPersistorUpdates) {
      this.unsubscribeFromPersistorUpdates();
    }
  }

  render() {
    return this.props.render(this.props.persistor, this.state.ready);
  }
}
