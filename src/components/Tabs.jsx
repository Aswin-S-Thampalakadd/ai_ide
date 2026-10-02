import React from "react";

function Tabs({ files, activeFile, onSelect, onClose }) {
  return (
    <div className="tabs">
      {files.map((file) => {
        const isActive = file.path === activeFile;

        const isModified = file.content !== file.savedContent;

        return (
          <div
            key={file.path}
            className={`tab ${isActive ? "active" : ""}`}
            onClick={() => onSelect(file.path)}
          >
            <span className="tab-name">
              {file.name}
              {isModified ? " •" : ""}
            </span>

            <button
              className="tab-close"
              onClick={(event) => {
                event.stopPropagation();

                onClose(file.path);
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;
