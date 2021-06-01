var { app, ipcRenderer } = require('electron').remote;
const remote = require('electron').remote;

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

const AppVersion = () => {
  return app.getVersion();
};

const DetectOS = () => {
  return process.platform.toLowerCase();
};

const DetecOSFolder = () => {
  const platforms = {
    win32: 'W32',
    darwin: 'mac',
    linux: 'Linux AMD64',
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};

export {
  SLMP,
  SystemGetLocale,
  AppDefaultPath,
  AppVersion,
  DetectOS,
  DetecOSFolder,
};
