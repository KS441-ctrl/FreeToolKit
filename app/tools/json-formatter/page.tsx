 "use client";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "hello": "world",\n  "count": 3\n}');
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const format = (compact = false) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, compact ? 0 : 2));
      setMessage("Valid JSON ✓");
    } catch (error) {
      setOutput("");
      setMessage(`Invalid JSON: ${(error as Error).message}`);
    }
  };
  return <main className="tool-page"><a className="back-link" href="/">← All tools</a><h1>JSON Formatter & Validator</h1><p className="intro">Format JSON into a readable structure or validate whether it parses correctly. Processing happens in your browser.</p>
    <section className="tool-panel"><label htmlFor="json-input">Input JSON</label><textarea id="json-input" value={input} onChange={e => setInput(e.target.value)} spellCheck={false} />
      <div className="button-row"><button onClick={() => format(false)}>Format JSON</button><button className="secondary" onClick={() => format(true)}>Minify JSON</button><button className="secondary" onClick={() => {setInput("");setOutput("");setMessage("");}}>Clear</button></div>
      {message && <p role="status" className="helper">{message}</p>}
      {output && <div style={{marginTop:18}}><label htmlFor="json-output">Output</label><textarea id="json-output" value={output} readOnly spellCheck={false} /><button style={{marginTop:12}} onClick={() => navigator.clipboard.writeText(output)}>Copy output</button></div>}
    </section></main>;
}
