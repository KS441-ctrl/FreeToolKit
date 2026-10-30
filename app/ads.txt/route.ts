import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export function GET(){const id=(process.env.ADSENSE_PUBLISHER_ID||"").trim().replace(/^pub-/i,"");if(!/^\d{10,30}$/.test(id))return new NextResponse("# Configure ADSENSE_PUBLISHER_ID after Google AdSense approval.\n",{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=300"}});return new NextResponse(`google.com, pub-${id}, DIRECT, f08c47fec0942fa0\n`,{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=3600"}})}
