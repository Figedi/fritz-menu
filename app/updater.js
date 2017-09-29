/* eslint-disable no-underscore-dangle */
import { get } from 'lodash';
import { Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import { stripIndent } from 'common-tags';

import { sleep } from './utils/promiseHelpers';

export const tryAutoUpdate = async () => {
  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    // log then rethrow
    console.log(`Error: ${err}`);
    throw err;
  }
};

const checkForUpdatesWithTimeout = () =>
  Promise.race([
    // throws timeout error
    sleep(2500, { shouldFail: true }),
    autoUpdater.checkForUpdates(),
  ]);

export const tryUpdate = () =>
  // resolve either not-available or available through a promise
  new Promise(async (resolve, reject) => {
    try {
      await checkForUpdatesWithTimeout();
      if (autoUpdater.updateAvailable) {
        await autoUpdater.downloadUpdate();
        new Notification({
          title: 'Update downloaded',
          body: stripIndent`
            Update for version ${get(autoUpdater, 'versionInfo.version', 'n/a')}
            downloaded, restarting now...
          `,
        }).show();
        await autoUpdater.quitAndInstall();
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
  });
