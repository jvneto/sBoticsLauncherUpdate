var remote = require('electron').remote;
var { screen } = remote;
var windowManager = remote.require('electron-window-manager');
import { AppDefaultPath } from '../utils/application-manager.js';

const LoadClose = () => {
  windowManager.close('load');
};

const LoginOpen = () => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.5);
  const width = Math.round((16 * height) / 11);

  var login = windowManager.createNew(
    'login',
    'sBotics Launcher',
    'file://' + __dirname + '/login.html',
    false,
    {
      width: width,
      height: height,
      showDevTools: false,
      DevTools: true,
      menu: null,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    },
  );

  login.open();
};

const LoginClose = () => {
  windowManager.close('login');
};

const IndexOpen = () => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.6);
  const width = Math.round((16 * height) / 9);

  var index = windowManager.createNew(
    'index',
    'sBotics Launcher',
    'file://' + __dirname + '/index.html',
    false,
    {
      width: width,
      height: height,
      showDevTools: false,
      DevTools: true,
      menu: null,
      frame: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    },
  );

  index.open();
};

export { LoadClose, LoginOpen, LoginClose, IndexOpen };
