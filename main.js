const { app, BrowserWindow, screen, ipcMain, remote } = require('electron');
const { autoUpdater } = require('electron-updater');
var windowManager = require('electron-window-manager');

const path = require('path');
const url = require('url');

var load_application;

const ScreenCalc = () => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  return ScreenSize;
};

const Load_OpenApplication = (screenSizeCalc) => {
  const height = Math.round(screenSizeCalc.height * 0.5);
  const width = Math.round((16 * height) / 11);
  // New
  windowManager.init({
    devMode: false,
    defaultWindowTitle: 'BlockEduc',
  });
  load_application = windowManager.createNew(
    'load',
    'sBotics Launcher',
    'file://' + __dirname + '/routes/load.html',
    false,
    {
      width: width, //300
      height: height, //350
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
  load_application.open();
};

app.on('ready', () => {
  Load_OpenApplication(ScreenCalc());
});

// ipcMain
ipcMain.on('get-version', (event) => {
  event.returnValue = app.getVersion();
});

ipcMain.on('app-defaultpath', (event) => {
  event.returnValue = __dirname;
});


// AutoUpdater
ipcMain.on('update-init', (event) => {
  autoUpdater
    .checkForUpdates()
    .then(() => (event.returnValue = true))
    .catch(() => (event.returnValue = false));
});

autoUpdater.on('checking-for-update', () => {
  load_application.webContents.send('update-checking', true);
});

autoUpdater.on('update-available', (info) => {
  load_application.webContents.send('update-available', {
    state: true,
    data: info,
  });
});

autoUpdater.on('update-not-available', (info) => {
  load_application.webContents.send('update-not-available', {
    state: false,
    data: info,
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  load_application.webContents.send('update-download-progress', {
    state: false,
    progress: progressObj,
  });
});

autoUpdater.on('update-downloaded', (info) => {
  load_application.webContents.send('update-downloaded', {
    state: true,
    info: info,
  });
});

ipcMain.on('update-install', (event) => {
  autoUpdater.quitAndInstall();
});
