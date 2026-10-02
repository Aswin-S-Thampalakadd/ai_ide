const { app, BrowserWindow, dialog, ipcMain } = require("electron");

const path = require("node:path");
const fs = require("node:fs/promises");
const { exec } = require("node:child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 950,
    minWidth: 1100,
    minHeight: 700,

    backgroundColor: "#1e1e1e",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

async function getDirectoryTree(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const result = [];

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist"
    ) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        path: fullPath,
        type: "directory",
        children: await getDirectoryTree(fullPath),
      });
    } else {
      result.push({
        name: entry.name,
        path: fullPath,
        type: "file",
      });
    }
  }

  result.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  return result;
}

ipcMain.handle("open-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  const folderPath = result.filePaths[0];

  const tree = await getDirectoryTree(folderPath);

  return {
    path: folderPath,
    name: path.basename(folderPath),
    tree,
  };
});

ipcMain.handle("read-file", async (_, filePath) => {
  return fs.readFile(filePath, "utf-8");
});

ipcMain.handle("write-file", async (_, { filePath, content }) => {
  await fs.writeFile(filePath, content, "utf-8");

  return true;
});

ipcMain.handle("run-command", async (_, { command, cwd }) => {
  return new Promise((resolve) => {
    exec(
      command,
      {
        cwd,
        shell: true,
        maxBuffer: 10 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          exitCode: error ? error.code ?? 1 : 0,
        });
      }
    );
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
