"use client";
import { useState } from "react";
import * as pdfjs from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from "xlsx";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); }
async function readPdf(file: File) {
  if (!file.name.toLowerCase().endsWith(".pdf")) throw new Error("Please select a PDF file.");
  if (file.size > 40 * 1024 * 1024) throw new Error("For browser stability, choose a PDF smaller than 40 MB.");
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: {page:number; items:{text:string;x:number;y:number}[]}[] = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n); const content = await page.getTextContent();
    const items = content.items.flatMap((item:any) => typeof item.str === "string" && item.str.trim() ? [{text:item.str,x:Number(item.transform?.[4]||0),y:Number(item.transform?.[5]||0)}] : []);
    pages.push({page:n,items});
  }
  return pages;
}
function toLines(pages: Awaited<ReturnType<typeof readPdf>>) {
  return pages.map(p => {
    const sorted = [...p.items].sort((a,b) => b.y-a.y || a.x-b.x); const lines:{y:number;items:typeof sorted}[]=[];
    for (const item of sorted) { let line=lines.find(l=>Math.abs(l.y-item.y)<3); if(!line){line={y:item.y,items:[]};lines.push(line);} line.items.push(item); }
    return {page:p.page,lines:lines.sort((a,b)=>b.y-a.y).map(l=>l.items.sort((a,b)=>a.x-b.x))};
  });
}
export default function PdfConvert(){
 const [file,setFile]=useState<File|null>(null); const [busy,setBusy]=useState(false); const [status,setStatus]=useState("");
 async function convert(kind:"txt"|"docx"|"xlsx") { if(!file){setStatus("Choose a PDF first.");return;} setBusy(true);setStatus("Reading selectable PDF text…");try{
  const pages=await readPdf(file); const hasText=pages.some(p=>p.items.length>0); if(!hasText) throw new Error("No selectable text was found. This may be a scanned PDF; use the OCR tool instead.");
  const lines=toLines(pages);
  if(kind==="txt") { const content=lines.map(p=>`--- Page ${p.page} ---\n${p.lines.map(l=>l.map(i=>i.text).join(" ")).join("\n")}`).join("\n\n"); download(new Blob([content],{type:"text/plain;charset=utf-8"}),"pdf-extracted-text.txt"); }
  if(kind==="docx") { const children:Paragraph[]=[]; for(const p of lines){children.push(new Paragraph({children:[new TextRun({text:`Page ${p.page}`,bold:true})],spacing:{before:200,after:100}})); for(const line of p.lines){const txt=line.map(i=>i.text).join(" ").trim();if(txt)children.push(new Paragraph({text:txt}));}} const doc=new Document({sections:[{properties:{},children}]}); const blob=await Packer.toBlob(doc);download(blob,"pdf-to-editable-text.docx"); }
  if(kind==="xlsx") { const rows:any[][]=[["Page","Line","Extracted text"]];for(const p of lines) p.lines.forEach((line,i)=>{const txt=line.map(it=>it.text).join(" ").trim();if(txt)rows.push([p.page,i+1,txt]);}); const ws=XLSX.utils.aoa_to_sheet(rows);ws["!cols"]=[{wch:10},{wch:10},{wch:100}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Extracted text");const bytes=XLSX.write(wb,{bookType:"xlsx",type:"array"});download(new Blob([bytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),"pdf-extracted-text.xlsx"); }
  setStatus(kind==="docx"?"Created an editable Word document from selectable text.":kind==="xlsx"?"Created an Excel workbook with one extracted text line per row.":"Extracted selectable text.");
 }catch(e){setStatus((e as Error).message||"Could not convert this PDF.");}finally{setBusy(false);} }
 return <main className="tool-page"><a className="back-link" href="/">← All tools</a><h1>PDF Conversion & Text Extraction</h1><p className="intro">Export PDF pages as images, extract selectable text, or create editable Word and Excel files from a PDF's text layer.</p><section className="tool-panel"><label htmlFor="convert-file">Choose a PDF</label><input id="convert-file" type="file" accept="application/pdf,.pdf" onChange={e=>{setFile(e.target.files?.[0]||null);setStatus("");}}/>{file&&<p className="helper">{file.name} · {(file.size/1024/1024).toFixed(2)} MB</p>}<div className="button-row" style={{flexWrap:"wrap"}}><button disabled={busy} onClick={()=>convert("docx")}>{busy?"Working…":"Convert to Word (.docx)"}</button><button disabled={busy} onClick={()=>convert("xlsx")}>Convert to Excel (.xlsx)</button><button disabled={busy} onClick={()=>convert("txt")}>Extract text (.txt)</button><a className="button secondary" href="/tools/pdf-editor?action=images">PDF pages to PNG/JPG →</a><a className="button secondary" href="/tools/pdf-ocr">OCR scanned PDF →</a></div>{status&&<div className="result" role="status" aria-live="polite">{status}</div>}<div className="notice"><strong>Conversion limits:</strong> PDF-to-Word preserves extracted text as editable paragraphs, not original page layout, fonts, columns, or images. Excel conversion places extracted text lines into rows; it does not reliably reconstruct tables or formulas. Scanned PDFs require OCR first. Processing happens in your browser.</div></section></main>
}
