 "use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [percent, setPercent] = useState("15");
  const [number, setNumber] = useState("200");
  const [result, setResult] = useState<string | null>(null);
  const calculate = () => {
    const p = Number(percent), n = Number(number);
    if (percent.trim() === "" || number.trim() === "" || !Number.isFinite(p) || !Number.isFinite(n)) { setResult("Enter valid numbers in both fields."); return; }
    setResult(`${p}% of ${n} = ${Number((p / 100 * n).toFixed(8))}`);
  };
  return <main className="tool-page"><a className="back-link" href="/">← All tools</a><h1>Percentage Calculator</h1><p className="intro">Find a percentage of any number quickly. For example, calculate 15% of 200.</p>
    <section className="tool-panel"><div className="form-grid"><div><label htmlFor="percent">Percentage (%)</label><input id="percent" type="number" value={percent} onChange={e => setPercent(e.target.value)} /></div><div><label htmlFor="number">Number</label><input id="number" type="number" value={number} onChange={e => setNumber(e.target.value)} /></div></div>
      <div className="button-row"><button onClick={calculate}>Calculate</button></div>
      {result && <div className="result" role="status"><strong>{result}</strong></div>}
      <p className="helper">Formula: percentage ÷ 100 × number.</p>
    </section></main>;
}
