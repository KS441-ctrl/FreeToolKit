import { NextRequest, NextResponse } from "next/server";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { acquirePdfRequestSlot, InvalidMultipartRequestError, readMultipartFormData, RequestBodyTimedOutError, RequestBodyTooLargeError } from "../_lib/pdf-request";
import { runProcessWithStdin } from "../_lib/run-process";
export const runtime = "nodejs";
const MAX_BYTES = 25 * 1024 * 1024;
const MAX_UPLOAD_BYTES = MAX_BYTES + 128 * 1024;
const MAX_OUTPUT_BYTES = MAX_BYTES * 2;
const SCRIPT = String.raw`import sys, fitz
src, dst = sys.argv[1], sys.argv[2]
page_no, x, y, w, h, size = int(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6]), float(sys.argv[7]), float(sys.argv[8])
color_hex = sys.argv[9].lstrip('#')
text = sys.stdin.read()
if page_no < 1 or w <= 0 or h <= 0 or size < 4 or size > 72 or len(text) > 1000:
    raise ValueError('Invalid page, rectangle, font size, or replacement text.')
color = tuple(int(color_hex[i:i+2],16)/255 for i in (0,2,4))
doc = fitz.open(src)
if page_no > len(doc): raise ValueError('Page number exceeds the document page count.')
page = doc[page_no-1]
rect = fitz.Rect(x, y, x+w, y+h)
if rect.x0 < 0 or rect.y0 < 0 or rect.x1 > page.rect.width or rect.y1 > page.rect.height:
    raise ValueError('The replacement rectangle must fit inside the selected page. PDF points use a top-left origin.')
page.add_redact_annot(rect, fill=(1,1,1), cross_out=False)
page.apply_redactions()
remaining = page.insert_textbox(rect, text, fontname='helv', fontsize=size, color=color, overlay=True)
if remaining < 0: raise ValueError('Replacement text does not fit in the selected rectangle. Increase its width/height or reduce font size.')
doc.save(dst, garbage=4, deflate=True)
doc.close()
`;
export async function POST(request: NextRequest) {
 const releaseSlot=acquirePdfRequestSlot();
 if(!releaseSlot)return NextResponse.json({error:"PDF processing is busy. Try again shortly."},{status:429,headers:{"Retry-After":"2","Cache-Control":"no-store"}});
 let directory="";
 try {
  const form=await readMultipartFormData(request,MAX_UPLOAD_BYTES);const file=form.get("file");
  if(!(file instanceof File)||!file.name.toLowerCase().endsWith(".pdf"))return NextResponse.json({error:"Choose a PDF file."},{status:400});
  if(!file.size||file.size>MAX_BYTES)return NextResponse.json({error:"PDF must be between 1 byte and 25 MB."},{status:413});
    const fileBytes=Buffer.from(await file.arrayBuffer());
    if(!fileBytes.subarray(0,1024).toString("latin1").includes("%PDF-"))return NextResponse.json({error:"The selected file does not contain a PDF header."},{status:400});
  const page=Number(form.get("page")),x=Number(form.get("x")),y=Number(form.get("y")),w=Number(form.get("w")),h=Number(form.get("h")),fontSize=Number(form.get("fontSize"));
  const text=String(form.get("text")||"");const color=String(form.get("color")||"#000000");
  if(!Number.isInteger(page)||page<1||![x,y,w,h,fontSize].every(Number.isFinite)||x<0||y<0||w<=0||h<=0||fontSize<4||fontSize>72||!/^#[0-9a-fA-F]{6}$/.test(color)||!text.trim()||text.length>1000)return NextResponse.json({error:"Check the page number, rectangle, font size, color, and replacement text."},{status:400});
    directory=await mkdtemp(path.join(tmpdir(),"everytool-replace-"));const input=path.join(directory,`${randomUUID()}.pdf`),output=path.join(directory,`${randomUUID()}.pdf`);await writeFile(input,fileBytes);
    try{await runProcessWithStdin(process.env.PYTHON_BIN||"python3",["-c",SCRIPT,input,output,String(page),String(x),String(y),String(w),String(h),String(fontSize),color],text,{timeoutMs:60000,maxStderrBytes:1024*1024});}
    catch(error){const err=error as NodeJS.ErrnoException & {stderr?:Buffer|string};if(err.code==="ENOENT")return NextResponse.json({error:"True text replacement requires Python 3 and PyMuPDF (fitz) on the server. See the Docker setup instructions."},{status:503});if(err.code==="ETIMEDOUT")return NextResponse.json({error:"PDF processing timed out. Try a smaller or simpler PDF."},{status:422});const detail=String(err.stderr||"").trim();return NextResponse.json({error:detail.includes("does not fit")?"Replacement text does not fit in the selected rectangle. Increase width/height or reduce font size.":detail.includes("page count")?"The page number is outside this PDF.":detail.includes("inside the selected page")?"The replacement rectangle extends beyond the page boundary.":"Could not replace text. The PDF may be encrypted, malformed, or unsupported. Check that you own or may edit this file."},{status:422});}
    if((await stat(output)).size>MAX_OUTPUT_BYTES)return NextResponse.json({error:"The processed PDF is too large to return safely."},{status:413});
  const bytes=await readFile(output);return new NextResponse(new Uint8Array(bytes),{headers:{"Content-Type":"application/pdf","Content-Disposition":"attachment; filename=pdf-text-replaced.pdf","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
 }catch(error){if(error instanceof RequestBodyTooLargeError)return NextResponse.json({error:"PDF must be 25 MB or smaller."},{status:413});if(error instanceof RequestBodyTimedOutError)return NextResponse.json({error:"The upload took too long. Try again on a stable connection."},{status:408});if(error instanceof InvalidMultipartRequestError)return NextResponse.json({error:"The upload request is malformed."},{status:400});return NextResponse.json({error:"The PDF could not be processed. Try a valid, smaller PDF."},{status:500});}finally{if(directory)await rm(directory,{recursive:true,force:true}).catch(()=>undefined);releaseSlot();}
}
