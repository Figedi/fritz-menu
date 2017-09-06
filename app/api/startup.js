import { remote } from 'electron';

export function enable() {
  const startupState = getState();
  return startupState ? true : remote.app.setLoginItemSettings({ openAtLogin: true });
}

export function disable() {
  const startupState = getState();
  return startupState ? remote.app.setLoginItemSettings({ openAtLogin: false }) : true;
}

export function getState() {
  return remote.app.getLoginItemSettings().openAtLogin;
}
