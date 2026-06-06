const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const ROOT_DIR = path.resolve(__dirname, '..');
const MAX_PORT_SCAN = 30;
const BACKEND_BASE_PORT = Number(process.env.SERVER_PORT || 4000);
const VITE_BASE_PORT = Number(process.env.VITE_PORT || 5173);

function resolveBinary(name) {
  const platformName = process.platform === 'win32' ? `${name}.cmd` : name;
  const tryPath = path.join(ROOT_DIR, 'node_modules', '.bin', platformName);
  if (fs.existsSync(tryPath)) {
    return tryPath;
  }
  return name;
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + MAX_PORT_SCAN; port += 1) {
    if (await checkPort(port)) {
      return port;
    }
  }
  throw new Error(`Unable to find available port in range ${startPort}-${startPort + MAX_PORT_SCAN}`);
}

function waitForPort(port, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function tryConnect() {
      const socket = new net.Socket();
      let settled = false;
      socket.setTimeout(1200);
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
        return reject(new Error(`Port ${port} did not respond within ${timeoutMs}ms`));
      }
      setTimeout(tryConnect, 500);
    }

    tryConnect();
  });
}

function createProcess(command, args, options) {
  const needsShell = process.platform === 'win32' && command.toLowerCase().endsWith('.cmd');
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: needsShell,
    ...options
  });

  proc.on('error', (error) => {
    console.error(`[dev-run] Process error for ${command}:`, error.message);
  });

  proc.on('exit', (code, signal) => {
    console.log(`[dev-run] ${command} exited with code ${code}${signal ? `, signal ${signal}` : ''}`);
  });
  return proc;
}

function shutdownChildren(children) {
  children.forEach((child) => {
    if (child && !child.killed) {
      child.kill('SIGINT');
    }
  });
}

(async () => {
  try {
    console.log('[dev-run] Finding available ports...');
    const backendPort = await findAvailablePort(BACKEND_BASE_PORT);
    const vitePort = await findAvailablePort(VITE_BASE_PORT);
    const env = {
      ...process.env,
      SERVER_PORT: String(backendPort),
      VITE_PORT: String(vitePort),
      VITE_DEV_SERVER_URL: `http://127.0.0.1:${vitePort}`
    };

    console.log(`[dev-run] Backend will use port ${backendPort}`);
    console.log(`[dev-run] Vite dev server will use port ${vitePort}`);

    const backendProcess = createProcess(process.execPath, [path.join(ROOT_DIR, 'server', 'src', 'index.js')], {
      cwd: ROOT_DIR,
      env
    });

    const viteCommand = resolveBinary('vite');
    const electronCommand = resolveBinary('electron');
    const viteProcess = createProcess(viteCommand, ['--config', path.join(ROOT_DIR, 'client', 'vite.config.js'), '--port', String(vitePort)], {
      cwd: ROOT_DIR,
      env
    });

    console.log('[dev-run] Waiting for backend and Vite to become ready...');
    await Promise.all([waitForPort(backendPort), waitForPort(vitePort)]);
    console.log('[dev-run] Backend and Vite are ready. Launching Electron...');

    const electronProcess = createProcess(electronCommand, ['.'], {
      cwd: ROOT_DIR,
      env
    });

    process.on('SIGINT', () => {
      shutdownChildren([electronProcess, backendProcess, viteProcess]);
      process.exit();
    });

    process.on('SIGTERM', () => {
      shutdownChildren([electronProcess, backendProcess, viteProcess]);
      process.exit();
    });

    electronProcess.on('exit', () => {
      shutdownChildren([backendProcess, viteProcess]);
      process.exit();
    });
  } catch (error) {
    console.error('[dev-run] Startup error:', error.message);
    process.exit(1);
  }
})();
