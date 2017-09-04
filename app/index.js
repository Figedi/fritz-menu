import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import Bootloader from './containers/Bootloader';
import Bootscreen from './components/Bootscreen';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

let store;

render(
  <AppContainer>
    <Bootloader
      persistor={configureStore()}
      render={(reduxStore, ready) => {
        store = reduxStore;
        return ready ? <Root store={store} history={history} /> : <Bootscreen />;
      }}
    />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require

    // ignore bootloader when hot-reloading
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
