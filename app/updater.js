import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

autoUpdater.on('error', (ev, err) => {
  console.log(`Event: ${JSON.stringify(ev)}. MESSAGE: ${err}`);
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(
    {
      title: 'Install Updates',
      message: 'Updates downloaded, FritzboxMenu will quit for update...',
    },
    () => {
      // restart and install
      autoUpdater.quitAndInstall();
    },
  );
});

autoUpdater.on('update-available', () => {
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
      }
    },
  );
});

export default () => autoUpdater.checkForUpdates();
