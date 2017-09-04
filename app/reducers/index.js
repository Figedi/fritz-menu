import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import graph from './graph';
import config from './config';
import fritz from './fritz';

const rootReducer = combineReducers({
  graph,
  config,
  fritz,
  routing,
  form: formReducer,
});

export default rootReducer;
