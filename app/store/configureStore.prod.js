import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage from 'localforage';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const history = createHashHistory();

function configureStore(initialState) {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // saga midldeware
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  // Thunk Middleware
  middleware.push(thunk);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux persist
  enhancers.push(autoRehydrate());

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));

  const enhancer = compose(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  sagaMiddleware.run(rootSaga);

  persistStore(store, {
    storage: localForage,
    blacklist: ['ui', 'graph', 'routing'],
  });

  return store;
}

export default { configureStore, history };
