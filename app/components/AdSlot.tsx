"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
const configuredClient=process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const configuredSlot=process.env.NEXT_PUBLIC_ADSENSE_SLOT;
const CLIENT=configuredClient&&/^ca-pub-\d+$/.test(configuredClient)?configuredClient:undefined;
const SLOT=configuredSlot&&/^\d+$/.test(configuredSlot)?configuredSlot:undefined;
declare global { interface Window { adsbygoogle?: unknown[] } }
export default function AdSlot(){
 const [allowed,setAllowed]=useState(false);
 useEffect(()=>{setAllowed(localStorage.getItem("everytool-optional-consent")==="accepted");},[]);
 if(!CLIENT||!SLOT||!allowed)return null;
 return <div className="ad-slot" aria-label="Advertisement"><span>Advertisement</span><Script id="everytool-adsense" async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`} crossOrigin="anonymous" strategy="afterInteractive" onLoad={()=>{try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{}}}/><ins className="adsbygoogle" style={{display:"block",minHeight:90}} data-ad-client={CLIENT} data-ad-slot={SLOT} data-ad-format="auto" data-full-width-responsive="true"/></div>;
}
