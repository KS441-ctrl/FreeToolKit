import type { Metadata } from "next";
import "./globals.css";
import AnalyticsConsent from "./components/AnalyticsConsent";
import AdSlot from "./components/AdSlot";

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  title: { default: "Free Toolkit | Free Online Tools", template: "%s | Free Toolkit" },
  description: "Free online PDF, text, developer, calculator, and student tools. Many tools run locally in your browser without uploading files.",
  applicationName: "Free Toolkit",
  keywords: ["free online tools", "PDF tools", "word counter", "JSON formatter", "calculators", "student tools"],
  openGraph: { title: "Free Toolkit | Free Online Tools", description: "Free online tools for PDF documents, text, developers, calculations, and study planning.", siteName: "Free Toolkit", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a className="brand" href="/" aria-label="Free Toolkit home">
            <span className="brand-mark">F</span> Free Toolkit
          </a>
          <nav aria-label="Main navigation">
            <a href="/#text-tools">Text</a>
            <a href="/#developer-tools">Developer</a>
            <a href="/#calculators">Calculators</a>
            <a href="/#student-tools">Students</a>
            <a href="/#pdf-tools">PDF tools</a>
          </nav>
        </header>
        {children}
        <AdSlot />
        <AnalyticsConsent />
        <footer className="site-footer">
          <div><strong>Free Toolkit</strong><p>Free tools. All in one place.</p></div>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/affiliate-disclosure">Affiliate disclosure</a>
            <a href="/resources">Resources</a>
            <a href="/affiliate-programs">Affiliate programs</a>
            <a href="mailto:CONTACT_EMAIL_REPLACE_ME">Contact</a>
          </div>
          <small>© {new Date().getFullYear()} Free Toolkit. Replace this contact address before launch.</small>
        </footer>
      </body>
    </html>
  );
}
