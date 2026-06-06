const path = require('path');
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const net = require('net');

const DEFAULT_BACKEND_PORT = Number(process.env.SERVER_PORT || 4000);
const DEFAULT_RENDERER_PORT = Number(process.env.VITE_PORT || 5173);
const MAX_PORT_SCAN = 30;
const STARTUP_TIMEOUT_MS = 30000;

let mainWindow = null;
let backendProcess = null;
let backendPort = DEFAULT_BACKEND_PORT;

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    show: false,
    backgroundColor: '#060712',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url: target }) => {
    if (target.startsWith('http')) {
      shell.openExternal(target);
    }
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + MAX_PORT_SCAN; port += 1) {
    if (await checkPort(port)) {
      return port;
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + MAX_PORT_SCAN}`);
}

function waitForPort(port, timeoutMs = STARTUP_TIMEOUT_MS) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function tryConnect() {
      const socket = new net.Socket();
      let settled = false;
      socket.setTimeout(1000);

      socket.once('connect', () => {
        settled = true;
        socket.destroy();
        resolve();
      });

      socket.once('timeout', () => {
        socket.destroy();
        if (!settled) retry();
      });

      socket.once('error', () => {
        socket.destroy();
        if (!settled) retry();
      });

      socket.connect(port, '127.0.0.1');
    }

    function retry() {
      if (Date.now() - start >= timeoutMs) {
        reject(new Error(`Port ${port} not reachable after ${timeoutMs}ms`));
        return;
      }
      setTimeout(tryConnect, 500);
    }

    tryConnect();
  });
}

function startBackendProcess() {
  if (backendProcess) {
    return;
  }

  const serverPath = path.resolve(__dirname, '../../server/src/index.js');
  backendProcess = spawn(process.execPath, [serverPath], {
    cwd: path.resolve(__dirname, '../..'),
    env: { ...process.env, PORT: String(backendPort) },
    stdio: ['ignore', 'inherit', 'inherit']
  });

  backendProcess.on('exit', (code, signal) => {
    console.log(`[electron] Backend process exited with code=${code} signal=${signal}`);
    backendProcess = null;
  });

  backendProcess.on('error', (error) => {
    console.error('[electron] Backend process failed to launch', error);
  });
}

async function bootstrap() {
  const rendererUrl = process.env.ELECTRON_START_URL ||
    (isDev ? (process.env.VITE_DEV_SERVER_URL || `http://127.0.0.1:${DEFAULT_RENDERER_PORT}`) :
      `file://${path.join(__dirname, '../../client/dist/index.html')}`);

  backendPort = Number(process.env.SERVER_PORT || DEFAULT_BACKEND_PORT);

  if (!isDev) {
    if (!(await checkPort(backendPort))) {
      backendPort = await findAvailablePort(DEFAULT_BACKEND_PORT);
      process.env.SERVER_PORT = String(backendPort);
      startBackendProcess();
      await waitForPort(backendPort);
    }
  } else {
    if (!(await checkPort(backendPort))) {
      startBackendProcess();
      await waitForPort(backendPort);
    }
    const rendererPort = Number(process.env.VITE_PORT || DEFAULT_RENDERER_PORT);
    await waitForPort(rendererPort);
  }

  createWindow(rendererUrl);
}

app.whenReady()
  .then(bootstrap)
  .catch((error) => {
    dialog.showErrorBox('Startup failed', error.message);
    app.quit();
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

ipcMain.handle('app:getBackendUrl', async () => {
  const port = Number(process.env.SERVER_PORT || backendPort);
  return `http://127.0.0.1:${port}`;
});

ipcMain.handle('app:getMetadata', async () => ({
  isDev,
  backendPort,
  rendererUrl: process.env.ELECTRON_START_URL || (isDev ? `http://127.0.0.1:${process.env.VITE_PORT || DEFAULT_RENDERER_PORT}` :
    `file://${path.join(__dirname, '../../client/dist/index.html')}`)
}));
