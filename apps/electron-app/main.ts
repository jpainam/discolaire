const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile(path.join(__dirname, "../../frontend/dist/index.html"));
  }
}

app.whenReady().then(createWindow);
