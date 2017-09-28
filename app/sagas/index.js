import { all, call } from 'redux-saga/effects';
import fritzSaga from './fritz';
import configSaga from './config';
import electronSaga from './electron';

export default function* rootSaga() {
  yield all([call(fritzSaga), call(configSaga), call(electronSaga)]);
}
