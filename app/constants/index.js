export const graphDataTemplate = {
  labels: [],
  datasets: [],
};

export const graphOptions = {
  scales: {
    xAxes: [
      {
        type: 'linear',
        position: 'bottom',
      },
    ],
  },
  animation: false,
  hover: false,
};

export const graphColors = {
  downstream: {
    media: 'rgb(52, 152, 219,1.0)',
    internet: 'rgb(231, 76, 60,1.0)',
  },
  upstream: {
    realtime: '3498db',
    high: 'e67e22',
    default: '27ae60',
    low: '2980b9',
  },
};

export const CONFIG_ACTIONS = {
  setFormField: 'CONFIG_SET_FORM_FIELD',
  commitForm: 'CONFIG_COMMIT_FORM',
};

export const FRITZ_ACTIONS = {
  stopInterval: 'FRITZ_STOP_INTERVAL',
  startInterval: 'FRITZ_START_INTERVAL',
  getData: 'FRITZ_DATA',
  getToken: 'FRITZ_TOKEN',
  getOS: 'FRITZ_OS',
  setError: 'FRITZ_ERROR',
  resetData: 'FRITZ_RESET_DATA',
  resetToken: 'FRITZ_RESET_TOKEN',
};

export const ELECTRON_ACTIONS = {
  checkForUpdates: 'ELECTRON_CHECK_FOR_UPDATES',
};
