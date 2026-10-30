import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
 const configuredBase=process.env.NEXT_PUBLIC_SITE_URL?.trim();
 return { rules:{userAgent:"*",allow:"/",disallow:["/api/"]},...(configuredBase?{sitemap:`${new URL(configuredBase).origin}/sitemap.xml`}:{}) };
}
