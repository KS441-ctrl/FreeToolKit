 "use client";
import { useMemo, useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length : 0;
    return { words, chars: text.length, noSpaces: text.replace(/\s/g, "").length, sentences, reading: Math.max(0, Math.ceil(words / 200)) };
  }, [text]);
  return <main className="tool-page">
    <a className="back-link" href="/">← All tools</a><h1>Word & Character Counter</h1>
    <p className="intro">Count words, characters, sentences, and estimated reading time as you type. Your text stays in this browser in this starter version.</p>
    <section className="tool-panel">
      <label htmlFor="text">Enter or paste your text</label>
      <textarea id="text" value={text} onChange={e => setText(e.target.value)} placeholder="Start typing or paste your text here..." />
      <div className="stats">
        <div className="stat"><strong>{stats.words}</strong> words</div><div className="stat"><strong>{stats.chars}</strong> characters</div><div className="stat"><strong>{stats.noSpaces}</strong> characters without spaces</div><div className="stat"><strong>{stats.sentences}</strong> sentences</div><div className="stat"><strong>{stats.reading}</strong> min read</div>
      </div>
      <div className="button-row"><button className="secondary" onClick={() => setText("")}>Clear text</button><button onClick={() => navigator.clipboard.writeText(text)} disabled={!text}>Copy text</button></div>
    </section>
  </main>;
}
