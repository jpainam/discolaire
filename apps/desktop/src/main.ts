import { app, BrowserWindow, dialog, ipcMain, safeStorage } from "electron";
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
const getEncryptedEnvPath = () =>
  path.join(getUserDataPath(), "discolaire.env.enc");
const getLogPath = () => path.join(getUserDataPath(), "desktop.log");

const logLine = (message: string) => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try {
    fs.appendFileSync(getLogPath(), line, "utf8");
  } catch {
    // ignore logging failures
  }
};

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

const stripQuotes = (value: string) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
};

const parseEnvContent = (content: string) => {
  const vars: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = stripQuotes(trimmed.slice(eq + 1).trim());
    vars[key] = value;
  }
  return vars;
};

const applyEnvVars = (vars: Record<string, string>) => {
  for (const [key, value] of Object.entries(vars)) {
    process.env[key] = value;
  }
};

// ---------------------------------------------------------------------------
// safeStorage – encrypt / decrypt env content
// ---------------------------------------------------------------------------

const saveEncryptedEnv = (plainText: string) => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("OS encryption is not available on this machine.");
  }
  const encrypted = safeStorage.encryptString(plainText);
  fs.mkdirSync(path.dirname(getEncryptedEnvPath()), { recursive: true });
  fs.writeFileSync(getEncryptedEnvPath(), encrypted);
  logLine("Encrypted env saved.");
};

const loadEncryptedEnv = (): string | null => {
  const encPath = getEncryptedEnvPath();
  if (!fs.existsSync(encPath)) return null;
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("OS encryption is not available on this machine.");
  }
  const encrypted = fs.readFileSync(encPath);
  return safeStorage.decryptString(encrypted);
};

const hasEncryptedEnv = () => fs.existsSync(getEncryptedEnvPath());

// ---------------------------------------------------------------------------
// Legacy migration: convert plain-text discolaire.env → encrypted
// ---------------------------------------------------------------------------

const migrateLegacyEnvFile = () => {
  const legacyPath = path.join(getUserDataPath(), "discolaire.env");
  if (!fs.existsSync(legacyPath)) return;
  if (hasEncryptedEnv()) {
    // Already migrated — delete plain-text file
    fs.unlinkSync(legacyPath);
    logLine("Deleted legacy plain-text env file (already migrated).");
    return;
  }
  try {
    const plainText = fs.readFileSync(legacyPath, "utf8");
    saveEncryptedEnv(plainText);
    fs.unlinkSync(legacyPath);
    logLine("Migrated legacy plain-text env file to encrypted storage.");
  } catch (error) {
    logLine(`Legacy migration failed: ${String(error)}`);
  }
};

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Server lifecycle
// ---------------------------------------------------------------------------

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
  if (!fs.existsSync(serverEntry)) {
    throw new Error(`Server entry not found: ${serverEntry}`);
  }

  logLine(`Starting server from: ${serverEntry}`);
  logLine(`Frontend root: ${frontendRoot}`);
  logLine(`Port: ${port}`);

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

// ---------------------------------------------------------------------------
// Windows
// ---------------------------------------------------------------------------

function createSetupWindow() {
  mainWindow = new BrowserWindow({
    title: "Discolaire — Setup",
    width: 720,
    height: 640,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.on("page-title-updated", (event) => {
    event.preventDefault();
  });

  mainWindow.loadFile(path.join(__dirname, "setup.html"));
}

function createAppWindow() {
  mainWindow = new BrowserWindow({
    title: "Discolaire",
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.on("page-title-updated", (event) => {
    event.preventDefault();
  });

  if (isDev) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const prodUrl = resolveBaseUrl();
    mainWindow.loadURL(prodUrl);
  }
}

// ---------------------------------------------------------------------------
// IPC handlers (setup page → main process)
// ---------------------------------------------------------------------------

ipcMain.handle("save-env", async (_event, envContent: string) => {
  try {
    // Validate that content has at least one KEY=VALUE pair
    const vars = parseEnvContent(envContent);
    if (Object.keys(vars).length === 0) {
      return { success: false, error: "No valid KEY=VALUE pairs found." };
    }

    saveEncryptedEnv(envContent);
    applyEnvVars(vars);

    // Close setup window, start server, open app window
    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    startServer();
    if (!isDev) {
      const baseUrl = resolveBaseUrl();
      if (isLocalHost(baseUrl)) {
        await waitForServer(baseUrl);
      }
    }
    createAppWindow();

    return { success: true };
  } catch (error) {
    logLine(`save-env error: ${String(error)}`);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle("get-env-template", () => {
  // Provide the .env.example content as a starting template
  const templatePaths = [
    path.join(appRoot, ".env.example"),
    path.join(appRoot, "..", ".env.example"),
  ];
  for (const p of templatePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf8");
    }
  }
  return null;
});

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

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
    if (isDev) {
      // Dev mode: skip encryption, just load the Next.js dev server
      createAppWindow();
      return;
    }

    // Migrate legacy plain-text env file if it exists
    migrateLegacyEnvFile();

    // Check for encrypted env
    const envContent = loadEncryptedEnv();
    if (!envContent) {
      // No env configured yet — show setup screen
      logLine("No encrypted env found. Showing setup screen.");
      createSetupWindow();
      return;
    }

    // Decrypt and apply env vars BEFORE starting the Next.js server
    const vars = parseEnvContent(envContent);
    applyEnvVars(vars);
    logLine(`Loaded ${Object.keys(vars).length} env vars from encrypted store.`);

    startServer();

    const baseUrl = resolveBaseUrl();
    if (isLocalHost(baseUrl)) {
      await waitForServer(baseUrl);
    }

    createAppWindow();
  } catch (error) {
    console.error(error);
    if (!isDev) {
      const logPath = getLogPath();
      dialog.showErrorBox(
        "Discolaire failed to start",
        [
          "The desktop app could not start the embedded server.",
          `Log file: ${logPath}`,
          `Error: ${String(error)}`,
          "Restart the app to try again.",
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
    if (!isDev && !hasEncryptedEnv()) {
      createSetupWindow();
    } else {
      createAppWindow();
    }
  }
});
