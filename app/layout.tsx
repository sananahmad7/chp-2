// app/layout.tsx
import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Footer from "@/components/layout/footer";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import NavBar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: { default: "CPH Analytics", template: "%s | CPH Analytics" },
  description: "Turning data into confident decisions.",
  metadataBase: new URL("https://cphanalytics.com"),
  openGraph: {
    title: "CPH Analytics",
    description: "Turning data into confident decisions.",
    url: "https://cphanalytics.com",
    siteName: "CPH Analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPH Analytics",
    description: "Turning data into confident decisions.",
  },
  // (Optional) explicit icons, see section 4 for favicon notes
  // icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#001a33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth motion-reduce:scroll-auto">
    <body
      className={cx(
        sfPro.variable,
        inter.variable,
        "bg-[var(--page-bg)] text-[var(--text-color)]"
      )}
      style={
        {
          // --- Brand tokens ---
          ["--brand" as any]: "#025eaa",
          ["--brand-rgb" as any]: "2 94 170",
          ["--accent-color" as any]: "var(--brand)",

          // --- Layout tokens ---
          ["--header-h" as any]: "4rem",
          // tweak the solid header color used after scroll
          ["--header-bg-rgb" as any]: "5 10 25",
        } as CSSProperties
      }
    >
    {/* Brand background layers (spotlight + masked grid) */}
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[var(--page-bg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,rgb(var(--brand-rgb)/.18),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(75%_55%_at_50%_25%,black,transparent)] bg-[linear-gradient(to_right,rgb(var(--brand-rgb)/.28)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--brand-rgb)/.28)_1px,transparent_1px)] bg-[size:56px_56px]" />
    </div>

    {/* Skip link */}
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-[100] rounded bg-[var(--surface)] px-3 py-2 text-sm ring-2 ring-[var(--accent-color)]"
    >
      Skip to content
    </a>

    {/* The nav *itself* is fixed/overlay. No wrapper that toggles. */}
    <NavBar />

    {/* Do not pad the page — keep hero under the header from first paint */}
    <main id="main" className="min-h-screen w-full">
      {children}
    </main>

    <Footer />
    <VercelAnalytics />
    </body>
    </html>
  );
}
