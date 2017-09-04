import { all, call } from 'redux-saga/effects';
import fritzSaga from './fritz';
import configSaga from './config';

export default function* rootSaga() {
  yield all([call(fritzSaga), call(configSaga)]);
}
