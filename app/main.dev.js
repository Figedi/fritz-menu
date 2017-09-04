/* eslint global-require: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *

 */
import { app } from 'electron';
import menubar from 'menubar';

let mainWindow = null;
const BASE = `file://${__dirname}`;

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

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

const mb = menubar({
  width: 850,
  height: 500,
  icon: `${__dirname}/assets/images/Icon.png`,
  'preload-window': true,
  tooltip: 'Fritzbox (Current Bandwidth Usage)',
  index: `${BASE}/app.html`,
  alwaysOnTop: process.env.NODE_ENV === 'development',
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

mb.on('after-create-window', async () => {
  mainWindow = mb.window;
  mb.showWindow();
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
    mainWindow.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
