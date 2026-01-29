import { app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import path from "path";

let mainWindow: BrowserWindow | null = null;
let serverProcess: ReturnType<typeof spawn> | null = null;

const isDev = !app.isPackaged;
const port = process.env.ELECTRON_PORT || process.env.PORT || "3000";
const devUrl =
  process.env.ELECTRON_DEV_URL || `http://localhost:${port}`;

const appRoot = isDev
  ? path.resolve(__dirname, "..")
  : process.resourcesPath;

const frontendRoot = isDev
  ? path.resolve(appRoot, "..", "frontend")
  : path.join(appRoot, "frontend");

const serverEntry = path.join(frontendRoot, "server.js");

async function waitForServer(url: string, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return;
    } catch {
      // ignore until timeout
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server not ready after ${timeoutMs}ms: ${url}`);
}

function startServer() {
  if (isDev) return;
  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: frontendRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: port,
    },
    stdio: "inherit",
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const prodUrl = `http://127.0.0.1:${port}`;
    mainWindow.loadURL(prodUrl);
  }
}

app.on("ready", async () => {
  try {
    startServer();
    if (!isDev) {
      await waitForServer(`http://127.0.0.1:${port}`);
    }
    createWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
