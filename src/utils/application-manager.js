var { app, ipcRenderer } = require('electron');

const SLMP = () => {
  try {
    return process.env.SLMP != undefined ? process.env.SLMP : false;
  } catch (error) {
    return false;
  }
};

const SystemGetLocale = () => {
  const locale = app.getLocale().replace('-', '_');
  return locale ? locale : 'en_US';
};

const AppDefaultPath = () => {
  return ipcRenderer.sendSync('app-defaultpath');
};

export { SLMP, SystemGetLocale, AppDefaultPath };
