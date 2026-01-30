import { app, BrowserWindow, dialog } from "electron";
import fs from "fs";
import path from "path";

let mainWindow: BrowserWindow | null = null;
let serverProcess: ReturnType<typeof import("child_process").spawn> | null = null;

const isDev = !app.isPackaged;
const port = process.env.ELECTRON_PORT || process.env.PORT || "3000";
const devUrl =
  process.env.ELECTRON_DEV_URL || `http://localhost:${port}`;

const appRoot = isDev
  ? path.resolve(__dirname, "..")
  : process.resourcesPath;

const frontendRoot = isDev
  ? path.resolve(appRoot, "..", "frontend")
  : path.join(appRoot, "frontend", "apps", "frontend");

const serverEntry = path.join(frontendRoot, "server.js");
app.setName("Discolaire");

const getUserDataPath = () => app.getPath("userData");
const getUserEnvPath = () => path.join(getUserDataPath(), "discolaire.env");
const getLogPath = () => path.join(getUserDataPath(), "desktop.log");

const logLine = (message: string) => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try {
    fs.appendFileSync(getLogPath(), line, "utf8");
  } catch {
    // ignore logging failures
  }
};

const appendStream = (label: string, data: Buffer | string) => {
  const text = typeof data === "string" ? data : data.toString("utf8");
  if (!text.trim()) return;
  logLine(`${label}: ${text.trim()}`);
};

const loadEnvFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

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
  const userEnvPath = getUserEnvPath();
  if (!fs.existsSync(serverEntry)) {
    throw new Error(`Server entry not found: ${serverEntry}`);
  }
  if (!fs.existsSync(userEnvPath)) {
    throw new Error(`Runtime env file not found: ${userEnvPath}`);
  }
  logLine(`Starting server from: ${serverEntry}`);
  logLine(`Env file: ${userEnvPath}`);
  logLine(`Frontend root: ${frontendRoot}`);
  logLine(`Port: ${port}`);
  loadEnvFile(userEnvPath);
  process.env.NODE_ENV = "production";
  process.env.PORT = port;

  const nextModulePath = path.join(frontendRoot, "node_modules", "next");
  logLine(
    `Next module exists: ${fs.existsSync(nextModulePath)} (${nextModulePath})`
  );

  // Run server.js with Electron-as-Node in production.
  const { spawn } = require("child_process") as typeof import("child_process");
  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: frontendRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: port,
      ELECTRON_RUN_AS_NODE: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  serverProcess.stdout?.on("data", (data) => appendStream("stdout", data));
  serverProcess.stderr?.on("data", (data) => appendStream("stderr", data));
  serverProcess.on("error", (err) => {
    logLine(`Server process error: ${String(err)}`);
  });
  serverProcess.on("exit", (code) => {
    const message = `Next.js server exited with code ${code}`;
    console.error(message);
    logLine(message);
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

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
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
    if (!isDev) {
      const userEnvPath = getUserEnvPath();
      const logPath = getLogPath();
      dialog.showErrorBox(
        "Discolaire failed to start",
        [
          "The desktop app could not start the embedded server.",
          `Make sure your runtime env file exists at: ${userEnvPath}`,
          `Log file: ${logPath}`,
          `Error: ${String(error)}`,
          "Then restart the app.",
        ].join("\n")
      );
    }
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
