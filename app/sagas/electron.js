import { call, take, all, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';

import { ELECTRON_ACTIONS } from '../constants';
import { ui } from '../actions';

function createIPCChannel() {
  return eventChannel(emitter => {
    function onIPCUpdate(event, args) {
      console.info('onIPCUpdate', event, args);
      emitter({ event, args });
    }

    ipcRenderer.on('update-reply', onIPCUpdate);

    // The subscriber must return an unsubscribe function
    return () => {
      ipcRenderer.removeListener('update-reply', onIPCUpdate);
    };
  });
}

function update() {
  ipcRenderer.send('update');
}

function* IPCReplySaga() {
  const chan = yield call(createIPCChannel);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield take(chan);
      yield put(ui.toggleUpdateButton());
    }
  } finally {
    console.log('IPC listening terminated');
  }
}

function* watchIPCSaga() {
  while (true) {
    yield take(ELECTRON_ACTIONS.checkForUpdates);
    yield put(ui.toggleUpdateButton());
    yield call(update);
  }
}

export default function* root() {
  yield all([call(watchIPCSaga), call(IPCReplySaga)]);
}
