import React, { useState } from "react";

function TreeItem({ item, onOpenFile, level = 0 }) {
  const [expanded, setExpanded] = useState(false);

  const isDirectory = item.type === "directory";

  function handleClick() {
    if (isDirectory) {
      setExpanded((value) => !value);
    } else {
      onOpenFile(item);
    }
  }

  return (
    <div>
      <div
        className="tree-item"
        style={{
          paddingLeft: `${12 + level * 16}px`,
        }}
        onClick={handleClick}
      >
        <span className="tree-icon">
          {isDirectory ? (expanded ? "▾" : "▸") : "·"}
        </span>

        <span className="tree-name">{item.name}</span>
      </div>

      {isDirectory && expanded && (
        <div>
          {item.children.map((child) => (
            <TreeItem
              key={child.path}
              item={child}
              onOpenFile={onOpenFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Explorer({ workspace, onOpenFile, onOpenFolder }) {
  return (
    <div className="explorer">
      <div className="panel-header">
        <span>EXPLORER</span>

        <button onClick={onOpenFolder} className="small-button">
          +
        </button>
      </div>

      {!workspace ? (
        <div className="empty-explorer">
          <p>No folder opened</p>

          <button onClick={onOpenFolder} className="open-folder-button">
            Open Folder
          </button>
        </div>
      ) : (
        <div className="tree">
          <div className="workspace-root">{workspace.name}</div>

          {workspace.tree.map((item) => (
            <TreeItem key={item.path} item={item} onOpenFile={onOpenFile} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Explorer;
