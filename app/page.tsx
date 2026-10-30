"use client";
import { useMemo, useState } from "react";

const groups = [
 {id:"pdf-tools",title:"PDF tools",subtitle:"Work with PDF pages and documents.",tools:[
  {icon:"📄",title:"Merge PDF",description:"Combine multiple PDF files into one.",href:"/tools/pdf-editor",badge:"Available"},
  {icon:"✂️",title:"Split PDF",description:"Extract selected pages into a new PDF.",href:"/tools/pdf-editor",badge:"Available"},
  {icon:"🔄",title:"Rotate PDF",description:"Rotate selected pages 90 degrees clockwise.",href:"/tools/pdf-editor",badge:"Available"},
  {icon:"🗑️",title:"Delete & Reorder Pages",description:"Remove pages or enter a new page order.",href:"/tools/pdf-editor",badge:"Available"},
  {icon:"📦",title:"Compress PDF",description:"Rasterize pages at adjustable quality to trade text searchability for file size.",href:"/tools/pdf-compress",badge:"Available"},
  {icon:"🖼️",title:"Image to PDF",description:"Convert images into a PDF document.",href:"/tools/image-to-pdf",badge:"Available"},
  {icon:"🖊️",title:"Annotate & Sign PDF",description:"Add text overlays, visual covers, highlights, drawing marks, typed signatures, and images.",href:"/tools/pdf-editor",badge:"Available"},
  {icon:"🔐",title:"Protect / Unlock PDF",description:"AES-256 password operations when qpdf is installed on the server.",href:"/tools/pdf-security",badge:"Server setup required"},
  {icon:"🖼️",title:"PDF to Images / Convert PDF",description:"Export pages as PNG/JPG, extract text, or create editable Word/Excel files.",href:"/tools/pdf-convert",badge:"Available"},
  {icon:"🔎",title:"OCR Scanned PDF",description:"Recognize text in scanned PDFs in your browser.",href:"/tools/pdf-ocr",badge:"Available"},
  {icon:"✏️",title:"Replace Existing PDF Text",description:"Redact a selected area and insert replacement text; requires PyMuPDF on the server.",href:"/tools/pdf-replace-text",badge:"Server setup required"},
  {icon:"🔢",title:"Page Numbers & Watermark",description:"Stamp page numbers or a watermark across a PDF.",href:"/tools/pdf-editor",badge:"Available"}
 ]},
 {id:"text-tools",title:"Text tools",subtitle:"Clean up, count, compare, and transform text.",tools:[
  {icon:"✍️",title:"Word & Character Counter",description:"Count words, characters, sentences, and reading time.",href:"/tools/word-counter",badge:"Popular"},
  {icon:"🔠",title:"Case Converter",description:"Convert uppercase, lowercase, title case, and sentence case.",href:"/tools/case-converter"},
  {icon:"🧹",title:"Remove Duplicate Lines",description:"Remove repeated lines while preserving order.",href:"/tools/duplicate-lines"},
  {icon:"↔️",title:"Text Comparison",description:"Compare two texts line by line.",href:"/tools/text-comparison"},
  {icon:"📝",title:"Text Formatter",description:"Normalize whitespace and clean up line breaks.",href:"/tools/text-formatter"}
 ]},
 {id:"developer-tools",title:"Developer tools",subtitle:"Useful helpers for coding and debugging.",tools:[
  {icon:"{}",title:"JSON Formatter",description:"Format, validate, and minify JSON.",href:"/tools/json-formatter",badge:"Popular"},
  {icon:"🔗",title:"URL Encoder / Decoder",description:"Encode or decode URL components.",href:"/tools/url-encoder"},
  {icon:"🔐",title:"Base64 Encoder / Decoder",description:"Convert text to and from Base64.",href:"/tools/base64"},
  {icon:"⏱️",title:"Timestamp Converter",description:"Convert Unix timestamps to readable dates.",href:"/tools/timestamp-converter"},
  {icon:".*",title:"Regex Tester",description:"Test JavaScript regular expressions.",href:"/tools/regex-tester"}
 ]},
 {id:"calculators",title:"Calculators",subtitle:"Get everyday answers quickly.",tools:[
  {icon:"%",title:"Percentage Calculator",description:"Calculate a percentage of a number.",href:"/tools/percentage-calculator"},
  {icon:"🎂",title:"Age Calculator",description:"Calculate age in years, months, and days.",href:"/tools/age-calculator"},
  {icon:"📅",title:"Date Difference",description:"Find the number of days between dates.",href:"/tools/date-difference"},
  {icon:"₹",title:"Loan EMI Calculator",description:"Estimate monthly loan payments and interest.",href:"/tools/loan-emi-calculator"},
  {icon:"📏",title:"Unit Converter",description:"Convert length, weight, and temperature units.",href:"/tools/unit-converter"}
 ]},
 {id:"student-tools",title:"Student tools",subtitle:"Simple tools to support study planning.",tools:[
  {icon:"🎓",title:"CGPA Calculator",description:"Calculate the average of semester CGPAs.",href:"/tools/cgpa-calculator"},
  {icon:"🗓️",title:"Study Timetable Generator",description:"Split study time across subjects.",href:"/tools/study-timetable"},
  {icon:"➗",title:"Mathematics Tools",description:"Calculate squares, cubes, and square roots.",href:"/tools/mathematics-tools"},
  {icon:"⏳",title:"Exam Countdown",description:"Count the days until an exam.",href:"/tools/exam-countdown"},
  {icon:"%",title:"Student Percentage Calculator",description:"Calculate percentages for marks.",href:"/tools/percentage-calculator"}
 ]}
];

export default function Home() {
 const [search,setSearch]=useState("");
 const filtered=useMemo(()=>groups.map(g=>({...g,tools:g.tools.filter(t=>`${t.title} ${t.description} ${g.title}`.toLowerCase().includes(search.toLowerCase()))})).filter(g=>g.tools.length),[search]);
 return <><section className="hero"><span className="eyebrow">Free tools. All in one place.</span><h1>One simple place for all your everyday tools.</h1><p>Useful text utilities, developer helpers, calculators, student tools, and PDF utilities — designed to get the job done without unnecessary steps.</p><div className="search-wrap"><span className="search-icon">⌕</span><input aria-label="Search tools" placeholder="Search tools, e.g. word counter or JSON..." value={search} onChange={e=>setSearch(e.target.value)}/></div></section><main>{filtered.map(group=><section className="section" id={group.id} key={group.id}><div className="section-head"><div><h2>{group.title}</h2><p>{group.subtitle}</p></div></div><div className="tool-grid">{group.tools.map(tool=><a className="tool-card" href={tool.href} key={tool.title}><div className="tool-icon">{tool.icon}</div><h3>{tool.title}</h3><p>{tool.description}</p>{tool.badge&&<span className="badge">{tool.badge}</span>}</a>)}</div></section>)}<div className="notice"><strong>More ways to support Free Toolkit:</strong> <a href="/resources">Recommended resources</a> · <a href="/affiliate-programs">Affiliate programs directory</a>. Affiliate links are disclosed and never required to use a tool.</div><div className="notice"><strong>Privacy-first direction:</strong> Most text and PDF editing operations run in your browser. Password protection requires qpdf to be installed on the server. Review PDF outputs carefully: visual covers are not secure redaction, and rasterized compression removes searchable text.</div></main></>;
}