import React, { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Explorer from "./components/Explorer";
import Tabs from "./components/Tabs";
import Editor from "./components/Editor";
import Terminal from "./components/Terminal";

function App() {
  const [workspace, setWorkspace] = useState(null);

  const [openFiles, setOpenFiles] = useState([]);

  const [activeFile, setActiveFile] = useState(null);

  const [terminalOpen, setTerminalOpen] = useState(true);

  async function openFolder() {
    console.log('clicked-------')
    const result = await window.ide.openFolder();

    if (!result) {
      return;
    }

    setWorkspace(result);
    setOpenFiles([]);
    setActiveFile(null);
  }

  async function openFile(file) {
    if (file.type !== "file") {
      return;
    }

    const existing = openFiles.find((item) => item.path === file.path);

    if (existing) {
      setActiveFile(file.path);
      return;
    }

    const content = await window.ide.readFile(file.path);

    const newFile = {
      name: file.name,
      path: file.path,
      content,
      savedContent: content,
    };

    setOpenFiles((current) => [...current, newFile]);

    setActiveFile(file.path);
  }

  function updateFileContent(content) {
    setOpenFiles((current) =>
      current.map((file) =>
        file.path === activeFile
          ? {
              ...file,
              content,
            }
          : file
      )
    );
  }

  async function saveFile() {
    const file = openFiles.find((item) => item.path === activeFile);

    if (!file) {
      return;
    }

    await window.ide.writeFile(file.path, file.content);

    setOpenFiles((current) =>
      current.map((item) =>
        item.path === file.path
          ? {
              ...item,
              savedContent: item.content,
            }
          : item
      )
    );
  }

  function closeFile(filePath) {
    const index = openFiles.findIndex((file) => file.path === filePath);

    const updated = openFiles.filter((file) => file.path !== filePath);

    setOpenFiles(updated);

    if (activeFile === filePath) {
      const nextFile = updated[index] || updated[index - 1];

      setActiveFile(nextFile ? nextFile.path : null);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();

        saveFile();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeFile, openFiles]);

  return (
    <div className="app">
      <div className="titlebar">
        <div className="brand">
          <span className="brand-icon">A</span>

          <span>Aswin IDE</span>
        </div>

        <div className="titlebar-actions">
          {workspace ? (
            <span className="workspace-name">{workspace.name}</span>
          ) : (
            <span>Welcome</span>
          )}
        </div>
      </div>

      <div className="main-layout">
        <Sidebar
          onOpenFolder={openFolder}
          terminalOpen={terminalOpen}
          setTerminalOpen={setTerminalOpen}
        />

        <div className="explorer-panel">
          <Explorer
            workspace={workspace}
            onOpenFile={openFile}
            onOpenFolder={openFolder}
          />
        </div>

        <div className="workspace">
          <Tabs
            files={openFiles}
            activeFile={activeFile}
            onSelect={setActiveFile}
            onClose={closeFile}
          />

          <div className="editor-area">
            <Editor
              file={openFiles.find((item) => item.path === activeFile)}
              onChange={updateFileContent}
            />
          </div>

          {terminalOpen && <Terminal cwd={workspace?.path} />}
        </div>
      </div>

      <div className="statusbar">
        <span>{workspace ? workspace.path : "No workspace opened"}</span>

        <span>{activeFile ? "JavaScript" : "Ready"}</span>
      </div>
    </div>
  );
}

export default App;
