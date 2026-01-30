import { app, BrowserWindow, dialog } from "electron";
import fs from "fs";
import path from "path";
import { Module } from "module";

let mainWindow: BrowserWindow | null = null;
let serverStarted = false;

const isDev = !app.isPackaged;
const port = process.env.ELECTRON_PORT || process.env.PORT || "3000";
const devUrl = process.env.ELECTRON_DEV_URL || `http://localhost:${port}`;

const appRoot = isDev ? path.resolve(__dirname, "..") : process.resourcesPath;

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

const stripQuotes = (value: string) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
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
    const value = stripQuotes(trimmed.slice(eq + 1).trim());
    process.env[key] = value;
  }
};

const resolveBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return `http://127.0.0.1:${port}`;
  try {
    const url = new URL(baseUrl);
    return url.toString();
  } catch {
    return `http://127.0.0.1:${port}`;
  }
};

const isLocalHost = (urlString: string) => {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    if (host === "localhost") return true;
    if (
      host.startsWith("127.") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.")
    ) {
      return true;
    }
    const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
    return isIpv4;
  } catch {
    return true;
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
  const baseUrl = resolveBaseUrl();
  logLine(`Base URL: ${baseUrl}`);
  if (!isLocalHost(baseUrl)) {
    logLine("Base URL is remote; skipping embedded server start.");
    return;
  }
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const { hostname, port: dbPort } = new URL(dbUrl);
      logLine(`DATABASE_URL host: ${hostname}${dbPort ? `:${dbPort}` : ""}`);
    }
  } catch {
    logLine("DATABASE_URL host: invalid URL");
  }
  process.env.NODE_ENV = "production";
  process.env.PORT = port;
  process.chdir(frontendRoot);
  process.env.NODE_PATH = path.join(frontendRoot, "node_modules");
  Module._initPaths();

  const nextModulePath = path.join(frontendRoot, "node_modules", "next");
  logLine(
    `Next module exists: ${fs.existsSync(nextModulePath)} (${nextModulePath})`,
  );

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(serverEntry);
    serverStarted = true;
  } catch (error) {
    logLine(`Server start error: ${String(error)}`);
    throw error;
  }
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
    const prodUrl = resolveBaseUrl();
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
      const baseUrl = resolveBaseUrl();
      if (isLocalHost(baseUrl)) {
        await waitForServer(baseUrl);
      }
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
        ].join("\n"),
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
  if (serverStarted) {
    logLine("App exiting; server was started in-process.");
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
