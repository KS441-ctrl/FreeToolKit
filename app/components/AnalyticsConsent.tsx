"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
const configuredGaId=process.env.NEXT_PUBLIC_GA_ID;
const GA_ID=configuredGaId&&/^G-[A-Z0-9]+$/i.test(configuredGaId)?configuredGaId:undefined;
export default function AnalyticsConsent(){
 const [choice,setChoice]=useState<"accepted"|"rejected"|null>(null);
 useEffect(()=>{const saved=localStorage.getItem("everytool-optional-consent");if(saved==="accepted"||saved==="rejected")setChoice(saved);},[]);
 const choose=(value:"accepted"|"rejected")=>{localStorage.setItem("everytool-optional-consent",value);setChoice(value);window.location.reload();};
 return <>{choice==="accepted"&&GA_ID&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive"/><Script id="everytool-ga" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${GA_ID}', { anonymize_ip: true });`}</Script></>}{choice===null&&(GA_ID||process.env.NEXT_PUBLIC_ADSENSE_CLIENT)&&<aside className="consent-banner" aria-label="Optional services consent"><p>Allow optional analytics and advertising technologies to help improve and support Free Toolkit. If you reject, these optional scripts stay off. Advertising in some regions requires a certified consent-management platform; configure one before launch where applicable.</p><div className="consent-actions"><button className="secondary" onClick={()=>choose("rejected")}>Reject optional services</button><button onClick={()=>choose("accepted")}>Allow optional services</button></div></aside>}</>;
}
