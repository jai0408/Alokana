import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Noto_Sans_Telugu, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const telugu = Noto_Sans_Telugu({ subsets: ["telugu"], weight: ["400", "600"], variable: "--font-telugu", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Alokana — Real Estate Accountability Project", template: "%s · Alokana" },
  description:
    "An independent public record of documented real-estate events in Telangana and Andhra Pradesh. Every claim points to evidence and shows its current status.",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/investigations", label: "Investigations" },
  { href: "/cases", label: "Case database" },
  { href: "/explore", label: "By geography" },
  { href: "/methodology", label: "Methodology" },
  { href: "/corrections", label: "Corrections" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${telugu.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="beta-bar">
          Public archive beta · All records shown are <strong>synthetic samples</strong> while the editorial and legal
          review process is set up.
        </div>
        <header className="site-header">
          <div className="wrap site-header__inner">
            <Link href="/" className="brand" aria-label="Alokana home">
              <span className="brand__mark" aria-hidden="true">
                ఆ
              </span>
              <span className="brand__text">
                <span className="brand__name">Alokana</span>
                <span className="brand__sub">Real Estate Accountability Project</span>
              </span>
            </Link>
            <nav className="nav" aria-label="Primary">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.label}
                </Link>
              ))}
              <Link href="/report" className="nav__cta">
                Report a concern
              </Link>
            </nav>
            <details className="nav-mobile">
              <summary>Menu</summary>
              <div className="nav-mobile__panel">
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href}>
                    {n.label}
                  </Link>
                ))}
                <Link href="/report">Report a concern</Link>
                <Link href="/right-of-reply">Right of reply</Link>
                <Link href="/independence">Funding &amp; independence</Link>
              </div>
            </details>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap site-footer__grid">
            <div>
              <p className="brand__name">Alokana</p>
              <p className="muted small">
                A public record of documented events, not a rumour board. Telangana and Andhra Pradesh, 2011–2026.
              </p>
              <p className="muted small telugu" lang="te">
                తెలుగు ఇంటర్‌ఫేస్ త్వరలో — మానవ సమీక్ష తర్వాత.
              </p>
            </div>
            <div>
              <p className="footer-h">Trust</p>
              <Link href="/methodology">Methodology</Link>
              <Link href="/corrections">Corrections</Link>
              <Link href="/right-of-reply">Right of reply</Link>
              <Link href="/independence">Funding &amp; independence</Link>
            </div>
            <div>
              <p className="footer-h">Archive</p>
              <Link href="/investigations">Investigations</Link>
              <Link href="/cases">Case database</Link>
              <Link href="/explore">Explore by geography</Link>
              <Link href="/report">Report a concern</Link>
            </div>
            <p className="footer-legal small muted">
              Records describe documented procedural events and attributed findings. A complaint, FIR or chargesheet is
              not a finding of guilt. Working name pending brand and legal review.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
