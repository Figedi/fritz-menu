import AutoLaunch from 'auto-launch';

const fritzLauncher = new AutoLaunch({
  name: 'Fritz Menulet',
  mac: {
    useLaunchAgent: true,
  },
});

export async function enable() {
  const startupState = await getState();
  return startupState ? true : fritzLauncher.enable();
}

export async function disable() {
  const startupState = await getState();
  return startupState ? fritzLauncher.disable : true;
}

export async function getState() {
  return fritzLauncher.isEnabled();
}
