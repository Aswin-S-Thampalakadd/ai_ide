const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ide", {
  openFolder: () => {
    return ipcRenderer.invoke("open-folder");
  },

  readFile: (filePath) => {
    return ipcRenderer.invoke("read-file", filePath);
  },

  writeFile: (filePath, content) => {
    return ipcRenderer.invoke("write-file", {
      filePath,
      content,
    });
  },

  runCommand: (command, cwd) => {
    return ipcRenderer.invoke("run-command", {
      command,
      cwd,
    });
  },
});
