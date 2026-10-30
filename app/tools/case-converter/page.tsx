 "use client";
import { useState } from "react";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const titleCase = (value: string) => value.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());
  const transform = (mode: string) => {
    if (mode === "upper") setText(text.toUpperCase());
    if (mode === "lower") setText(text.toLowerCase());
    if (mode === "title") setText(titleCase(text));
    if (mode === "sentence") setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase()));
    if (mode === "clear") setText("");
  };
  return <main className="tool-page"><a className="back-link" href="/">← All tools</a><h1>Case Converter</h1><p className="intro">Change text to uppercase, lowercase, title case, or sentence case. Paste your text and choose a conversion.</p>
    <section className="tool-panel"><label htmlFor="case-text">Your text</label><textarea id="case-text" value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text here..." />
      <div className="button-row"><button onClick={() => transform("upper")}>UPPERCASE</button><button onClick={() => transform("lower")} className="secondary">lowercase</button><button onClick={() => transform("title")} className="secondary">Title Case</button><button onClick={() => transform("sentence")} className="secondary">Sentence case</button><button onClick={() => transform("clear")} className="secondary">Clear</button></div>
      <p className="helper">This is a lightweight first version. Review names, acronyms, and specialist formatting after conversion.</p>
    </section></main>;
}
