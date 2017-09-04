import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { Bootloader, Bootscreen } from './components';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

const store = configureStore();
render(
  <AppContainer>
    <Bootloader persistor={store}>
      {ready => (ready ? <Root store={store} history={history} /> : <Bootscreen />)}
    </Bootloader>
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
