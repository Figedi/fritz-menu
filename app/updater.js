/* eslint-disable no-underscore-dangle */
import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

import { sleep } from './utils/promiseHelpers';

function onUpdateError(ev, err) {
  console.log(`Event: ${JSON.stringify(ev)}. MESSAGE: ${err}`);
}

function onUpdateDownloaded() {
  return new Promise(resolve => {
    dialog.showMessageBox(
      {
        title: 'Install Updates',
        message: 'Updates downloaded, FritzboxMenu will quit for update...',
      },
      () => {
        // restart and install
        autoUpdater.quitAndInstall();
        resolve(); // not reeeallly executed anymore
      },
    );
  });
}

function onUpdateAvailable() {
  return new Promise(resolve => {
    dialog.showMessageBox(
      {
        type: 'question',
        title: 'Update Available',
        message: 'Update to FritzboxMenu available. Would you like to update now?',
        buttons: ['Update & Restart', 'Cancel'],
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
          resolve(true);
        } else {
          resolve(false);
        }
      },
    );
  });
}

function onNoUpdateAvailable() {
  dialog.showErrorBox('No Update available', 'No Update available');
}

autoUpdater.on('error', onUpdateError);
autoUpdater.on('update-downloaded', onUpdateDownloaded);
autoUpdater.on('update-available', onUpdateAvailable);

export const tryAutoUpdate = autoUpdater.checkForUpdates;

export const tryUpdate = () =>
  Promise.race([
    // throws timeout error
    sleep(2500, { shouldFail: true }),
    // resolve either not-available or available through a promise
    new Promise(resolve => {
      function onUpdateNotAvailable() {
        onNoUpdateAvailable();
        // reset (there is no default callback for update-not-available)
        autoUpdater.removeListener('update-available', _onUpdateAvailable);
        return resolve(false);
      }

      async function _onUpdateAvailable() {
        const willDownload = await onUpdateAvailable();
        // reset to original callback
        autoUpdater.removeListener('update-not-available', onUpdateNotAvailable);
        autoUpdater.on('update-available', onUpdateAvailable);
        return resolve(willDownload);
      }
      // note there is no default not-available callback
      autoUpdater.once('update-not-available', onUpdateNotAvailable);

      // deregister available-callback, then use _onUpddateAvailable (for promise resolution)
      autoUpdater.removeListener('update-available', onUpdateAvailable);
      autoUpdater.once('update-available', _onUpdateAvailable);

      autoUpdater.checkForUpdates();
    }),
  ]);
