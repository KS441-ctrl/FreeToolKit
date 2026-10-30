import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
 const configuredBase=process.env.NEXT_PUBLIC_SITE_URL?.trim();
 if(!configuredBase)return [];
 const base=new URL(configuredBase).origin;
 const paths=["/","/privacy","/terms","/affiliate-disclosure","/affiliate-programs","/resources","/tools/pdf-editor","/tools/pdf-replace-text","/tools/pdf-compress","/tools/pdf-convert","/tools/pdf-ocr","/tools/pdf-security","/tools/image-to-pdf","/tools/word-counter","/tools/case-converter","/tools/duplicate-lines","/tools/text-comparison","/tools/text-formatter","/tools/json-formatter","/tools/url-encoder","/tools/base64","/tools/timestamp-converter","/tools/regex-tester","/tools/percentage-calculator","/tools/age-calculator","/tools/date-difference","/tools/loan-emi-calculator","/tools/unit-converter","/tools/cgpa-calculator","/tools/study-timetable","/tools/mathematics-tools","/tools/exam-countdown"];
 return paths.map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path==="/"?"weekly":"monthly",priority:path==="/"?1:0.6}));
}
