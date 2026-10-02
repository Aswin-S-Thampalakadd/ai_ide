import React from "react";

import EditorComponent from "@monaco-editor/react";

function getLanguage(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  const languages = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    html: "html",
    css: "css",
    scss: "scss",
    md: "markdown",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    yml: "yaml",
    yaml: "yaml",
    xml: "xml",
  };

  return languages[extension] || "plaintext";
}

function Editor({ file, onChange }) {
  if (!file) {
    return (
      <div className="editor-empty">
        <div className="editor-logo">A</div>

        <h2>Aswin IDE</h2>

        <p>Open a project and start coding.</p>

        <div className="shortcut-list">
          <span>
            <kbd>Ctrl</kbd>
            <kbd>S</kbd>
            Save
          </span>

          <span>
            <kbd>Ctrl</kbd>
            <kbd>`</kbd>
            Terminal
          </span>
        </div>
      </div>
    );
  }

  return (
    <EditorComponent
      height="100%"
      theme="vs-dark"
      language={getLanguage(file.name)}
      value={file.content}
      onChange={(value) => onChange(value ?? "")}
      options={{
        automaticLayout: true,
        fontSize: 14,
        minimap: {
          enabled: true,
        },
        padding: {
          top: 10,
        },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        renderWhitespace: "selection",
        tabSize: 2,
      }}
    />
  );
}

export default Editor;
