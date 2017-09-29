/* eslint global-require: 0, no-mixed-operators: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *

 */
import { app, BrowserWindow, Tray, ipcMain } from 'electron';
import { tryAutoUpdate, tryUpdate } from './updater';
import { envHelpers } from './utils';

let tray;
let mainWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
  require('electron-context-menu')();
}

// Don't show the app in the doc
app.dock.hide();

app.on('ready', async () => {
  createTray();
  createWindow();

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  if (envHelpers.isProdLike) {
    // activate the auto-updater, this checks on github for the latest releases
    tryAutoUpdate();

    ipcMain.on('update', async event => {
      try {
        const returnStatus = await tryUpdate();
        event.sender.send('update-reply', { returnStatus });
      } catch (e) {
        event.sender.send('update-reply', { returnStatus: false, error: e.message });
      }
    });
  }

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
    mainWindow.openDevTools({ mode: 'detach' });
  }
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

const createTray = () => {
  tray = new Tray(`${__dirname}/icons/16x16.png`);
  tray.setToolTip('Fritzbox (Current Bandwidth Usage)');

  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', event => {
    toggleWindow();

    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({ mode: 'detach' });
    }
  });
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x, y };
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 500,
    show: process.env.NODE_ENV === 'development',
    alwaysOnTop: process.env.NODE_ENV === 'development',
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // Hide the window when it loses focus
  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();
};
