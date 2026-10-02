import React from "react";

function Sidebar({ onOpenFolder, terminalOpen, setTerminalOpen }) {
  return (
    <div className="sidebar">
      <button
        className="sidebar-button"
        title="Open Folder"
        onClick={onOpenFolder}
      >
        📁
      </button>

      <button className="sidebar-button" title="Explorer">
        📄
      </button>

      <button className="sidebar-button" title="Search">
        🔍
      </button>

      <div className="sidebar-spacer" />

      <button
        className={`sidebar-button ${terminalOpen ? "active" : ""}`}
        title="Terminal"
        onClick={() => setTerminalOpen((value) => !value)}
      ></button>
    </div>
  );
}

export default Sidebar;
