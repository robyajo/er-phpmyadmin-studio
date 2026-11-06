import fs from "node:fs";
import path from "node:path";
import { app, BrowserWindow, Menu, MenuItem, nativeTheme, nativeImage } from "electron";
import { ipcMain } from "electron/main";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { UpdateSourceType, updateElectronApp } from "update-electron-app";
import { ipcContext } from "@/ipc/context";
import { IPC_CHANNELS, inDevelopment } from "./constants";
import {
  PROTOCOL_NAME,
  handleProtocolUrl,
  registerOAuthIpcHandlers,
  registerProtocolClient,
} from "./main/oauth";
import { registerUpdaterIpcHandlers } from "./main/updater";
import { getBasePath } from "./utils/path";

let mainWindow: BrowserWindow | null = null;

// Register custom deep link protocol: xphpmyadmin://
registerProtocolClient();

// Ensure single instance lock for deep links
if (process.platform === "linux") {
  app.setName("xphpmyadmin-desktop");
  try {
    const homeDir = process.env.HOME || "";
    const desktopEntryDir = path.join(homeDir, ".local/share/applications");
    const desktopEntryFile = path.join(desktopEntryDir, "xphpmyadmin-desktop.desktop");
    const iconFullPath = path.resolve(process.cwd(), "assets/icon.png");
    if (fs.existsSync(desktopEntryDir) && fs.existsSync(iconFullPath) && !fs.existsSync(desktopEntryFile)) {
      const entryContent = `[Desktop Entry]\nName=xphpMyAdmin Desktop\nComment=xphpMyAdmin Desktop Development\nExec=/usr/bin/true\nIcon=${iconFullPath}\nTerminal=false\nType=Application\nStartupWMClass=xphpmyadmin-desktop\nCategories=Development;Database;\n`;
      fs.writeFileSync(desktopEntryFile, entryContent, "utf-8");
    }
  } catch {
    // ignore
  }
}

const isPrimaryInstance = app.requestSingleInstanceLock();

if (!isPrimaryInstance) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();

      const urlArg = commandLine.find((arg) =>
        arg.startsWith(`${PROTOCOL_NAME}://`)
      );
      if (urlArg) {
        handleProtocolUrl(urlArg, mainWindow);
      }
    }
  });

  // macOS protocol open-url handler
  app.on("open-url", (event, url) => {
    event.preventDefault();
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
      handleProtocolUrl(url, mainWindow);
    }
  });
}

function createWindow() {
  const basePath = getBasePath();
  const preload = path.join(basePath, "preload.js");
  const candidateIconPaths = [
    path.join(process.resourcesPath, "assets/icon.png"),
    path.resolve(app.getAppPath(), "assets/icon.png"),
    path.resolve(process.cwd(), "assets/icon.png"),
    path.join(__dirname, "../renderer/main_window/assets/icon.png"),
  ];
  const appIconPath = candidateIconPaths.find((p) => fs.existsSync(p));
  const appIcon = appIconPath ? nativeImage.createFromPath(appIconPath) : undefined;

  mainWindow = new BrowserWindow({
    backgroundColor: "#07080a",
    height: 780,
    icon: appIcon,
    minHeight: 520,
    minWidth: 720,
    title: "xphpMyAdmin Desktop",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    trafficLightPosition:
      process.platform === "darwin" ? { x: 12, y: 11 } : undefined,
    webPreferences: {
      contextIsolation: true,
      devTools: inDevelopment,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,

      preload,
    },
    width: 1240,
  });
  ipcContext.setMainWindow(mainWindow);

  // Enable right-click context menu with Copy / Cut / Paste / Select All across the app
  mainWindow.webContents.on("context-menu", (_event, params) => {
    const menu = new Menu();

    if (params.selectionText && params.selectionText.trim().length > 0) {
      menu.append(new MenuItem({ role: "copy", label: "Salin (Copy)" }));
      menu.append(new MenuItem({ type: "separator" }));
    }

    if (params.isEditable) {
      menu.append(new MenuItem({ role: "cut", label: "Potong (Cut)" }));
      menu.append(new MenuItem({ role: "copy", label: "Salin (Copy)" }));
      menu.append(new MenuItem({ role: "paste", label: "Tempel (Paste)" }));
      menu.append(new MenuItem({ type: "separator" }));
    }

    menu.append(new MenuItem({ role: "selectAll", label: "Pilih Semua (Select All)" }));
    menu.popup();
  });

  const notifyWindowState = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("window-state-change", {
        isMaximized: mainWindow.isMaximized(),
      });
    }
  };

  mainWindow.on("maximize", notifyWindowState);
  mainWindow.on("unmaximize", notifyWindowState);
  mainWindow.on("resize", notifyWindowState);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(basePath, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Check launch argv for custom protocol deep link
  const urlArg = process.argv.find((arg) =>
    arg.startsWith(`${PROTOCOL_NAME}://`)
  );
  if (urlArg) {
    mainWindow.webContents.once("did-finish-load", () => {
      handleProtocolUrl(urlArg, mainWindow);
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Extensions installed successfully: ${result.name}`);
  } catch {
    console.error("Failed to install extensions");
  }
}

function checkForUpdates() {
  updateElectronApp({
    notifyUser: true,
    updateInterval: "1 hour",
    updateSource: {
      repo: "ajoroby/xphpmyadmin",
      type: UpdateSourceType.ElectronPublicUpdateService,
    },
  });
}

async function setupORPC() {
  const { rpcHandler } = await import("./ipc/handler");

  ipcMain.on(IPC_CHANNELS.START_ORPC_SERVER, (event) => {
    const [serverPort] = event.ports;

    serverPort.start();
    rpcHandler.upgrade(serverPort);
  });
}

app.whenReady().then(async () => {
  try {
    nativeTheme.themeSource = "dark";
    createWindow();
    registerOAuthIpcHandlers(() => mainWindow);
    registerUpdaterIpcHandlers(() => mainWindow);
    await installExtensions();
    checkForUpdates();
    await setupORPC();
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
});

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends
