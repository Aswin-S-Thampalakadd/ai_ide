import React, { useEffect, useRef, useState } from "react";

function Terminal({ cwd }) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function executeCommand() {
    const value = command.trim();

    if (!value) {
      return;
    }

    if (!cwd) {
      setHistory((current) => [
        ...current,
        {
          command: value,
          output: "Open a project folder first.",
        },
      ]);

      setCommand("");

      return;
    }

    setHistory((current) => [
      ...current,
      {
        command: value,
        output: "Running...",
      },
    ]);

    setCommand("");

    const result = await window.ide.runCommand(value, cwd);

    const output = [result.stdout, result.stderr].filter(Boolean).join("\n");

    setHistory((current) => [
      ...current.slice(0, -1),
      {
        command: value,
        output: output || `Process exited with code ${result.exitCode}`,
      },
    ]);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      executeCommand();
    }
  }

  return (
    <div className="terminal">
      <div className="terminal-header">
        <span>TERMINAL</span>

        <button className="terminal-clear" onClick={() => setHistory([])}>
          Clear
        </button>
      </div>

      <div className="terminal-output">
        {history.map((item, index) => (
          <div key={index} className="terminal-entry">
            <div className="terminal-command">
              <span className="prompt">$</span>

              <span>{item.command}</span>
            </div>

            {item.output && <pre>{item.output}</pre>}
          </div>
        ))}
      </div>

      <div className="terminal-input-row">
        <span className="prompt">$</span>

        <input
          ref={inputRef}
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={cwd ? "Enter command..." : "Open a project first"}
          disabled={!cwd}
        />
      </div>
    </div>
  );
}

export default Terminal;
