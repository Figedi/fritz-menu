/* eslint-disable no-underscore-dangle */
import { Notification } from 'electron';
import { autoUpdater } from 'electron-updater';

import { sleep } from './utils/promiseHelpers';

// function onUpdateError(ev, err) {
//   console.log(`Event: ${JSON.stringify(ev)}. MESSAGE: ${err}`);
// }
//
// function onUpdateDownloaded() {
//   return new Promise(resolve => {
//     dialog.showMessageBox(
//       {
//         title: 'Install Updates',
//         message: 'Updates downloaded, FritzboxMenu will quit for update...',
//       },
//       () => {
//         // restart and install
//         autoUpdater.quitAndInstall();
//         resolve(); // not reeeallly executed anymore
//       },
//     );
//   });
// }
//
// function onUpdateAvailable() {
//   return new Promise(resolve => {
//     dialog.showMessageBox(
//       {
//         type: 'question',
//         title: 'Update Available',
//         message: 'Update to FritzboxMenu available. Would you like to update now?',
//         buttons: ['Update & Restart', 'Cancel'],
//       },
//       buttonIndex => {
//         if (buttonIndex === 0) {
//           autoUpdater.downloadUpdate();
//           resolve(true);
//         } else {
//           resolve(false);
//         }
//       },
//     );
//   });
// }
//
// function onNoUpdateAvailable() {
//   dialog.showErrorBox('No Update available', 'No Update available');
// }
//
// // note that we only want to register update-downloaded once
// function registerDefaultEventListeners({ initial = false }) {
//   if (initial) {
//     autoUpdater.on('update-downloaded', onUpdateDownloaded);
//   }
//   autoUpdater.on('error', onUpdateError);
//   autoUpdater.on('update-available', onUpdateAvailable);
// }
//
// // note that we do not remove the downloaded listener, as we do not overwrite it in tryUpdate
// function removeAllEventListeners() {
//   autoUpdater.removeAllListeners('error');
//   autoUpdater.removeAllListeners('update-available');
//   autoUpdater.removeAllListeners('update-not-available');
// }
//
// function restoreAllEventListeners() {
//   removeAllEventListeners();
//   registerDefaultEventListeners();
// }
//
// registerDefaultEventListeners({ initial: true });

export const tryAutoUpdate = async () => {
  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    // log then rethrow
    console.log(`Error: ${err}`);
    throw err;
  }
};

export const tryUpdate = () =>
  Promise.race([
    // throws timeout error
    sleep(2500, { shouldFail: true }),
    // resolve either not-available or available through a promise
    new Promise(async (resolve, reject) => {
      try {
        await autoUpdater.checkForUpdates();
        if (autoUpdater.updateAvailable) {
          await autoUpdater.checkForUpdatesAndNotify();
          // well this gets restarted then..
          resolve(true);
        } else {
          new Notification({
            title: 'No update available',
            body: 'No new update available',
          }).show();
          resolve(false);
        }
      } catch (err) {
        console.log(`Error: ${err}`);
        reject(err);
      }

      // function onUpdateNotAvailable() {
      //   onNoUpdateAvailable();
      //   restoreAllEventListeners();
      //   return resolve(false);
      // }
      //
      // function _onError(event, e) {
      //   restoreAllEventListeners();
      //   reject(e);
      // }
      //
      // async function _onUpdateAvailable() {
      //   const willDownload = await onUpdateAvailable();
      //   restoreAllEventListeners();
      //   return resolve(willDownload);
      // }
      // removeAllEventListeners();
      // autoUpdater.once('error', _onError);
      // autoUpdater.once('update-available', _onUpdateAvailable);
      // autoUpdater.once('update-not-available', onUpdateNotAvailable);
      //
      // autoUpdater.checkForUpdates();
    }),
  ]);
