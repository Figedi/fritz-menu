import { call, take, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';

import { ELECTRON_ACTIONS } from '../constants';

function createIPCChannel() {
  return eventChannel(emitter => {
    function onIPCUpdate(event, args) {
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
  ipcRenderer.send('update', { test: 256 });
}

function* IPCReplySaga() {
  const chan = yield call(createIPCChannel);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const { event, args } = yield take(chan);
      // todo: enable button
      console.log('some IPC event', event, args);
    }
  } finally {
    console.log('IPC listening terminated');
  }
}

function* watchIPCSaga() {
  while (true) {
    yield take(ELECTRON_ACTIONS.checkForUpdates);
    // todo: disable button
    yield call(update);
  }
}

export default function* root() {
  yield all([call(watchIPCSaga), call(IPCReplySaga)]);
}
