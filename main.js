const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
const {dialog} = require('electron');

// Run Server
const sever = require('./app.js');

// Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// Define the menu
let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}

// Open a window that displays the version
let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
function createDefaultWindow() {
  win = new BrowserWindow({
    width: 1020,
    height: 800
  });

  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

  win.loadURL(`http://localhost:3000/#v${app.getVersion()}`);
  return win;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + Math.floor(progressObj.percent) + '%';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

// Ask the user if update if update available
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  var index = dialog.showMessageBox(win, {
    type: 'info',
    title: 'Update available',
    message: `New version is available, do you want to install it now?`,
    buttons: ['Update', 'Cancel'],
    defaultId: 0
  });
    if (index === 0) {
      autoUpdater.quitAndInstall();
    }
})

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});
