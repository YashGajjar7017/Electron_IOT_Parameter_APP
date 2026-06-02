const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const net = require('net');

let backendProcess = null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    (isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../../client/dist/index.html')}`);
  mainWindow.loadURL(startUrl);

//   if (isDev) {
//     mainWindow.webContents.openDevTools();
//   }
}

function startBackend() {
  const serverPath = path.resolve(__dirname, '../../server/src/index.js');
  backendProcess = spawn(process.execPath, [serverPath], {
    stdio: 'inherit'
  });

  backendProcess.on('exit', () => {
    backendProcess = null;
  });
}

app.on('ready', () => {
  if (!isDev) {
    startBackend();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

ipcMain.handle('device:connect', async (_event, payload) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(6000);

    socket.once('connect', () => {
      const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
      socket.destroy();
      resolve({ connected: true, remoteAddress });
    });

    socket.once('error', (error) => {
      resolve({ connected: false, error: error.message });
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve({ connected: false, error: 'Connection timed out' });
    });

    socket.connect(payload.port, payload.ipAddress);
  });
});
