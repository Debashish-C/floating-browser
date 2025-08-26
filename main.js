const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Optional: Suppress some Chromium warnings
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.commandLine.appendSwitch("ignore-certificate-errors");

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false, // remove OS default window
    transparent: true, // fully transparent
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      partition: "persist:main", // persistent storage to reduce IO errors
    },
  });

  win.loadFile("index.html");

  // IPC for window controls
  ipcMain.on("minimize-window", () => win.minimize());
  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on("close-window", () => win.close());
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
