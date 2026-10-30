 "use client";
import { useState } from "react";
export default function AgeCalculator() {
 const [dob,setDob]=useState("");const [result,setResult]=useState("");
 const calc=()=>{if(!dob){setResult("Select your date of birth.");return;}const birth=new Date(dob+"T00:00:00");const now=new Date();if(birth>now){setResult("Date of birth cannot be in the future.");return;}let years=now.getFullYear()-birth.getFullYear(),months=now.getMonth()-birth.getMonth(),days=now.getDate()-birth.getDate();if(days<0){months--;days+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}if(months<0){years--;months+=12;}setResult(`${years} years, ${months} months, ${days} days`);};
 return <main className="tool-page"><a className="back-link" href="/">← All tools</a><h1>Age Calculator</h1><p className="intro">Calculate your age in years, months, and days.</p><section className="tool-panel"><label htmlFor="dob">Date of birth</label><input id="dob" type="date" value={dob} onChange={e=>setDob(e.target.value)}/><button style={{marginTop:14}} onClick={calc}>Calculate age</button>{result&&<div className="result" role="status">{result}</div>}</section></main>;
}