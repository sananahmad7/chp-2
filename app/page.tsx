// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import BookConsultationModalTrigger from "@/components/BookConsultationModalTrigger";
import ServicesGridWithModal from "@/components/ServicesGridWithModal";
import ComplianceModal from "@/components/ComplianceModal";
import HeroVideo from "@/components/HeroVideo";
import BookDemoModalTrigger from "@/components/BookDemoModalTrigger";
import CasesGridWithModal from "@/components/CasesGridWithModal";
import type { Scene } from "@/components/story/StickyStory";
import FadeIn from "@/components/shared/FadeIn";
import FadeInRight from "@/components/shared/FadeInRight";

/* -----------------------------------------------------------------------------
 * SEO
 * --------------------------------------------------------------------------- */

const SITE_NAME = "CPH Analytics";
const SITE_DESCRIPTION =
  "Pricing, tenders, sell-out and shortage signals for Nordic life sciences, traceable, explainable, and built for regulated workflows.";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

/* -----------------------------------------------------------------------------
 * Links
 * --------------------------------------------------------------------------- */

const CLIENT_LOGIN_URL = "https://lsp.cphanalytics.com/";

/**
 * Demo booking popup:
 * - This is what the modal embeds.
 * - For now we embed your existing /contact page in an iframe.
 * - The `embed=1` param is optional, but it lets you later render a slimmer "embedded" layout on /contact if you want.
 */
const DEMO_BOOKING_URL = "/contact?topic=life-sciences&embed=1";

/* -----------------------------------------------------------------------------
 * Client-only components (safe for static export)
 * --------------------------------------------------------------------------- */

function HeroRightMapSkeleton() {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <div className="h-full rounded-2xl bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm" />
    </div>
  );
}

/**
 * IMPORTANT:
 * This should be your marketing-first right panel:
 * - no SWR
 * - no /api calls
 * - no "0 packs" / "- SKUs"
 * - instead: coverage + capabilities + governance + CTA
 */
const HeroRightMap = dynamic(() => import("@/components/HeroRightMap"), {
  ssr: false,
  loading: () => <HeroRightMapSkeleton />,
});

/**
 * StickyStory is a client component (uses IntersectionObserver etc.)
 * Keep it client-only to avoid build-time issues in static export.
 */
const StickyStory = dynamic(() => import("@/components/story/StickyStory"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center font-inter text-[var(--muted-text)]">
      Loading story...
    </div>
  ),
});

/* -----------------------------------------------------------------------------
 * Content
 * --------------------------------------------------------------------------- */

const scenes = [
  {
    id: "lead",
    kicker: "Launches & Returns",
    title: "Launch & return dynamics across chains",
    body: "See launches, withdrawals, and back on market items as they appear across Nordic free pricing chains. Track adoption by country and chain, with ATC codes and pack (Vnr/EAN) context. Keep an audit trail via source linked observations.",
    media: {
      src: "/images/two.jpg",
      alt: "Nordic chain adoption view with ATC tags highlighting new and back on market SKUs",
    },
  },
  {
    id: "shortage",
    kicker: "Shortage Risk",
    title: "Shortage risk for the next period",
    body: "Detect SKUs with a high likelihood of shortage next period, using availability patterns, abrupt price moves, and pack updates. Scores are explainable and flagged at SKU chain country granularity.",
    media: {
      src: "/images/three.webp",
      alt: "Shortage early warning list with explainable risk scores and drivers",
    },
  },
  {
    id: "signal",
    kicker: "Price Signals",
    title: "Price shifts & supply tension",
    body: "Surface changes with last checked timestamps and chain coverage. Combine with shortage risk to separate scarcity from deliberate repositioning and to size expected elasticity by pack.",
    media: {
      src: "/images/four.jpg",
      alt: "Charts showing retail price deltas with supply-tension indicators and last-checked timestamps",
    },
  },
  {
    id: "models",
    kicker: "Scenarios",
    title: "Price scenarios that ingest shortage risk",
    body: "Feed shortage probability and recent deltas into scenario models. For Denmark’s sealed bid A-price, compare options by win probability, expected turnover, and margin, biasing the recommendation when shortage risk is elevated.",
    media: {
      src: "/images/four.avif",
      alt: "Scenario comparison with win probability and turnover curves for A price bids",
    },
  },
  {
    id: "outcomes",
    kicker: "Measured Impact",
    title: "From signal to measured action",
    body: "Ship a price or allocation change and track outcomes, turnover, share, and tender effects, so your next cycle starts with evidence, not guesswork.",
    media: {
      src: "/images/five.png",
      alt: "Dashboard tracking KPI impact after pricing and availability changes at pack level",
    },
  },
] satisfies Scene[];

const pillars = [
  {
    title: "Pricing visibility that stands up to scrutiny",
    body: "Source linked observations, last checked timestamps, and a clear trail from input to decision surface, designed for regulated teams.",
  },
  {
    title: "Tender and scenario support (where applicable)",
    body: "Compare bid options with transparent assumptions and outputs you can share internally, so decisions are explainable and reproducible.",
  },
  {
    title: "Shortage signals that your team can act on",
    body: "Early warnings with drivers and granularity aligned to how teams operate: SKU / pack / chain / country.",
  },
] as const;

const services = [
  {
    title: "Market Access & Pricing",
    body: "Model tender scenarios, manage price corridors, and support pricing cycles with explainable recommendations.",
    details:
      "Navigate complex Nordic pricing regulations with high-fidelity simulation models. We provide a central cockpit for managing multi-country price corridors, ensuring compliance while maximizing local market opportunity.",
    bullets: [
      "Competitive tender bid simulations",
      "Denmark A-price scenario modeling",
      "Internal & external price referencing",
      "Margin erosion prevention alerts",
      "Chain-specific adoption tracking",
    ],
    href: "/life-sciences/market-access-pricing",
  },
  {
    title: "Commercial Analytics",
    body: "Brand performance, launch tracking, and KAM ready insights across Nordic free pricing chains.",
    details:
      "Transform raw distribution data into clear commercial signals. Our analytics engine tracks product adoption at the SKU-chain-country level, providing Key Account Managers with the evidence needed for pharmacy chain negotiations.",
    bullets: [
      "Real-time launch trajectory tracking",
      "Pharmacy chain stocking compliance",
      "Market share delta analysis",
      "Automated weekly performance exports",
      "Vnr/EAN level granular insights",
    ],
    href: "/life-sciences/commercial-analytics",
  },
  {
    title: "Supply & Shortages",
    body: "Predict stock outs, monitor shortage signals, and drive proactive allocation with auditable rationale.",
    details:
      "Move from reactive firefighting to proactive supply management. By analyzing abrupt price moves and availability patterns, we flag SKUs with a high likelihood of shortage before they impact patients.",
    bullets: [
      "Next-period shortage probability scores",
      "Availability pattern detection",
      "Abrupt price move alerts",
      "Distribution gap visualization",
      "Explainable drivers for every flag",
    ],
    href: "/life-sciences/supply-shortages",
  },
  {
    title: "Evidence & Safety",
    body: "AI assisted screening (PICO/PRISMA), RWE/HEOR support, and auditable reviews with rationale.",
    details:
      "Accelerate medical affairs and safety workflows with AI-assisted literature screening. Our platform supports RWE and HEOR teams by automating the initial stages of systematic reviews while maintaining a full audit trail.",
    bullets: [
      "Automated PICO/PRISMA screening",
      "RWE/HEOR data aggregation",
      "Safety signal cross-referencing",
      "Auditable reviewer rationale",
      "Source-linked evidence logs",
    ],
    href: "/life-sciences/evidence-safety",
  },
  {
    title: "Tender Intelligence",
    body: "Historical bid analysis and competitor positioning for hospital and retail tenders.",
    details:
      "Gain a competitive edge in public procurement. We aggregate historical tender outcomes to visualize competitor pricing behavior, helping you optimize your bidding strategy for Nordic hospital tenders.",
    bullets: [
      "Competitor price-point mapping",
      "Historical win/loss trend analysis",
      "Regional demand forecasting",
      "Automatic tender notification alerts",
      "Post-tender impact assessment",
    ],
    href: "/life-sciences/tender-intelligence",
  },
  {
    title: "RWE Data Engineering",
    body: "Dependable pipelines for Real World Evidence and HEOR data synthesis.",
    details:
      "High-quality evidence starts with clean data. We build auditable engineering pipelines that ingest disparate healthcare data sources, transforming them into study-ready datasets for RWE and Health Economics.",
    bullets: [
      "Standardized OMOD/CDM mapping",
      "Audit-friendly data transformations",
      "Automated QC & validation reporting",
      "Secure GxP-compliant storage",
      "Lineage tracking from source to study",
    ],
    href: "/life-sciences/rwe-engineering",
  },
  {
    title: "Regulatory Intelligence",
    body: "Track Vnr/EAN changes, MA transfers, and withdrawal signals across the Nordics.",
    details:
      "Stay ahead of administrative changes that impact market availability. Our bots monitor regulatory portals to flag MA transfers and withdrawal signals before they disrupt your commercial supply chain.",
    bullets: [
      "MA Transfer monitoring (Denmark/Sweden)",
      "Vnr/EAN metadata change logs",
      "Withdrawal intention early-signals",
      "Regulatory timeline visualizations",
      "Direct source-document linking",
    ],
    href: "/life-sciences/regulatory-intelligence",
  },
  {
    title: "Pharmacy Chain Strategy",
    body: "Pricing and availability dynamics specifically for private retail chain negotiations.",
    details:
      "Level the playing field with large pharmacy chains. We provide the sell-out and stock-level visibility needed to hold chains accountable to their distribution agreements and pricing corridors.",
    bullets: [
      "Private label entry alerts",
      "Chain-specific inventory visibility",
      "Stock-out penalty audit support",
      "Price compliance monitoring",
      "Retail margin erosion analysis",
    ],
    href: "/life-sciences/pharmacy-strategy",
  },
] as const;

const cases = [
  {
    title: "A price tender simulator (Denmark)",
    summary:
      "Compared bid options by win probability, expected turnover, and margin using competitive price distributions.",
    details:
      "Using historical bid data from Amgros, we built a Monte Carlo simulation tool. It allows users to input their production costs and desired margin to see a 'heat map' of win probabilities against various bid levels, specifically optimized for the Danish A-price sealed bid system.",
    impact: "Better decisions without unnecessary margin erosion.",
    href: "/work/a-price-simulator",
    image: {
      src: "https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?cs=srgb&dl=pexels-christina-morillo-1181396-12969403.jpg&fm=jpg",
      alt: "Laptop showing charts and graphs on screen",
    },
  },
  {
    title: "Shortage early warning for distributor)",
    summary:
      "Signals for shortages and returns across regions and vendors with SKU level explainability.",
    details:
      "By aggregating inventory snapshots across four Nordic warehouses, the system detects 'velocity spikes' and distribution gaps. It flags potential stock-outs 14 days before they occur, providing KAMs with an auditable rationale for proactive allocation.",
    impact: "Faster interventions and fewer stock outs.",
    href: "/work/shortage-early-warning",
    image: {
      src: "/images/six.jpg",
      alt: "Warehouse worker scanning inventory with a barcode scanner",
    },
  },
  {
    title: "Veterinary price intelligence (SE/NO)",
    summary:
      "Continuous price checks across pharmacy chains with traceability and last checked timestamps.",
    details:
      "A custom web-scraping engine that monitors the leading veterinary pharmacy chains in Sweden and Norway. It provides a daily 'price corridor' report, ensuring that wholesale pricing remains competitive while tracking OTC retail markups.",
    impact:
      "Clear pricing corridors and improved compliance across assortments.",
    href: "/work/vet-pricing-intelligence",
    image: {
      src: "https://images.pexels.com/photos/6251701/pexels-photo-6251701.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6251701.jpg&fm=jpg",
      alt: "Veterinarian examining a dog in a clinic",
    },
  },
  {
    title: "Commercial Launch Tracker",
    summary:
      "Real-time adoption metrics for new-to-market generic entries in the Finnish market.",
    details:
      "This tool tracks the 'speed of stocking' across private pharmacy chains. It provides manufacturers with immediate feedback on which retailers are meeting their listing agreements during the critical first 30 days of launch.",
    impact: "Immediate identification of listing gaps and improved launch ROI.",
    href: "/work/launch-tracker",
    image: {
      src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      alt: "Group of professionals in a meeting",
    },
  },
] as const;

/* -----------------------------------------------------------------------------
 * Styling helpers
 * --------------------------------------------------------------------------- */

const heroGridStyle = {
  ["--hero-card-h" as any]: "clamp(520px,66vh,760px)",
} as CSSProperties;

function SectionHeader({
  title,
  subtitle,
  ctaHref,
  ctaText,
}: {
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaText?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="font-outfit text-2xl font-semibold text-[var(--text-color)] md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl font-inter text-[var(--muted-text)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {ctaHref && ctaText ? (
        <Link
          href={ctaHref}
          className="hidden font-inter text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] sm:inline"
        >
          {ctaText} →
        </Link>
      ) : null}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * Page
 * --------------------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section
        aria-labelledby="hero-heading"
        /* Reduced min-h from 68/74vh to 60/65vh */
        className="relative isolate min-h-[60vh] w-full overflow-y-hidden overflow-x-clip sm:min-h-[62vh] lg:min-h-[65vh]"
      >
        {/* Video Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <HeroVideo
            poster="/video/lsp-hero-poster.webp"
            sources={[
              { src: "/video/lsp-hero.webm", type: "video/webm" },
              { src: "/video/lsp-hero.mp4", type: "video/mp4" },
            ]}
            className="h-full w-full scale-[1.1] object-cover sm:scale-[1.28] lg:scale-[1.34]"
            objectPosition="center 85%"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,51,0.48))]"
          />
        </div>

        <div className=" lg:px-15 mx-auto w-full px-4  pb-10 pt-16  sm:px-8 sm:pb-12 sm:pt-20 md:pb-14 md:pt-24">
          <div
            /* Reduced grid min-height slightly */
            className="grid min-h-[clamp(350px,45vh,550px)] w-full min-w-0 max-w-full items-stretch gap-6 lg:grid-cols-12 lg:gap-0"
            style={heroGridStyle}
          >
            {/* Left Section: Increased width to col-span-8 to help heading fit on 2 lines */}
            <div className="min-w-0 lg:col-span-8 lg:min-h-[var(--hero-card-h)] xl:col-span-7">
              <div className="relative mt-5 flex h-full w-full min-w-0 max-w-full flex-col p-0 lg:mt-0">
                <h1
                  id="hero-heading"
                  /* font-outfit heading */
                  className="mt-3 font-outfit text-4xl font-bold leading-tight text-white sm:text-6xl md:text-7xl md:leading-[1.05]"
                >
                  Price &amp; tender overview for Nordic pharma
                </h1>

                <p className="mt-4 max-w-prose font-inter text-base leading-7 text-white/80 sm:mt-7 sm:text-lg">
                  Clear signals for pricing, tenders, and supply risk, delivered
                  with traceability and explainability that regulated teams can
                  trust.
                </p>

                <ul className="mt-5 space-y-2 font-inter text-sm text-white/80 sm:mt-6">
                  <li>
                    • Source linked observations and audit friendly exports
                  </li>
                  <li>
                    • Scenario support for pricing/tender decisions (where
                    applicable)
                  </li>
                  <li>• Shortage signals with explainable drivers</li>
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3 font-inter sm:mt-9 sm:gap-4">
                  <BookConsultationModalTrigger
                    label="Book a demo"
                    title="Schedule a walkthrough"
                    className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-6 py-[0.85rem] text-base font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                  />

                  <a
                    href="#lsp-story-heading"
                    className="inline-flex items-center whitespace-normal break-words text-white/90 underline decoration-white/50 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                  >
                    See the platform story →
                  </a>
                </div>

                <div className="mt-4 font-inter sm:mt-9">
                  <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/75">
                    <li>Nordic coverage</li>
                    <li className="hidden sm:inline">•</li>
                    <li>Traceable signals</li>
                    <li className="hidden sm:inline">•</li>
                    <li>ISO 27001 / GDPR ready</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Section: Reduced width to col-span-4 and pushed to the end */}
            <div className="relative mt-6 min-w-0 overflow-hidden lg:col-span-4 lg:col-start-9 lg:mt-0 lg:min-h-[var(--hero-card-h)]">
              <HeroRightMap
                initialCountry="DK"
                className="h-full w-full max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section
        id="pillars"
        aria-labelledby="pillars-heading"
        className="relative scroll-mt-24 overflow-hidden border-t border-gray-200 bg-white py-24 lg:py-32"
      >
        <div className="mx-auto w-full px-4 sm:px-8 lg:px-16">
          <FadeIn>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <h2 className="font-outfit text-sm font-bold uppercase tracking-widest text-[#025eaa]">
                  Our Foundation
                </h2>
                <h3
                  id="pillars-heading"
                  className="mt-3 font-outfit text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl"
                >
                  Built for regulated life science teams
                </h3>
              </div>
              <p className="max-w-md font-inter text-lg text-gray-600">
                A marketing homepage shouldn’t pretend to be a live dashboard.
                Instead: show coverage, capability, and why you’re credible.
              </p>
            </div>

            {/* High Contrast Feature Grid */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {pillars.map((p, idx) => (
                <article
                  key={p.title}
                  /* Changed to rounded-md and increased border/shadow contrast */
                  className="group relative flex flex-col rounded-md border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-[#025eaa] hover:shadow-md"
                >
                  {/* Numbering - Light Blue Watermark */}
                  <div className="absolute right-6 top-6">
                    <span className="font-outfit text-5xl font-bold text-[#025eaa] opacity-10">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="relative mt-2">
                    <h3 className="font-outfit text-xl font-bold text-gray-900">
                      {p.title}
                    </h3>

                    <p className="mt-6 font-inter text-sm leading-relaxed text-gray-600">
                      {p.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </FadeIn>

          {/* CTA Walkthrough - High Contrast */}
          <div className="mt-20 rounded-md border border-gray-200 bg-gray-50 p-8 sm:p-12">
            <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#025eaa]">
                  Live Demo Available
                </div>
                <h3 className="mt-6 font-outfit text-3xl font-bold text-gray-900 sm:text-4xl">
                  Want a concrete walkthrough <br className="hidden md:block" />{" "}
                  for your market?
                </h3>
                <p className="mt-4 max-w-xl font-inter text-lg text-gray-600">
                  We’ll show what’s covered, how signals are derived, and how
                  traceability works end to end.
                </p>
              </div>

              <div className="flex justify-start lg:col-span-5 lg:justify-end">
                <BookConsultationModalTrigger
                  label="Request a walkthrough"
                  title="Request a walkthrough"
                  className="inline-flex items-center justify-center rounded-md bg-[#025eaa] px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-[#014a87] active:scale-95"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pharma Insights / LSP Intro */}
      <section
        id="lsp-story"
        aria-labelledby="lsp-heading"
        className="lg:py-25 relative scroll-mt-24 overflow-hidden border-t border-gray-100 bg-white py-10 "
      >
        {/* Minimalist Background Accents */}
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] translate-x-1/4 opacity-10 [background:radial-gradient(circle_at_center,rgba(2,94,170,0.4)_0,transparent_70%)]" />

        <div className="mx-auto w-full px-4 sm:px-8 lg:px-16">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            {/* Left: Content Side */}
            <div className="lg:col-span-7 xl:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#025eaa]">
                  Platform Overview
                </div>

                <h2
                  id="lsp-heading"
                  className="mt-6 font-outfit text-4xl font-bold tracking-tight text-gray-900 md:text-5xl md:leading-[1.1] lg:text-5xl"
                >
                  Pharma insights with <br />
                  <span className="text-[#025eaa]">Life Science Pro</span>
                </h2>

                <div className="mt-8 space-y-6">
                  <p className="max-w-3xl font-inter text-lg leading-relaxed text-gray-600">
                    Track Nordic moves, launches, withdrawals, returns, supply
                    gaps, and retail price shifts, plus next period shortage
                    risk, across free pricing chains for human and veterinary
                    products. Sales data is available in Denmark.
                  </p>

                  {/* Quote/Highlight Box */}
                  <div className="flex max-w-2xl items-start gap-4 rounded-md border-l-4 border-[#025eaa] bg-gray-50 p-6 shadow-sm">
                    <p className="font-inter text-sm leading-7 text-gray-600">
                      <strong className="text-[11px] uppercase tracking-wide text-gray-900">
                        The Platform Story:
                      </strong>
                      <br />
                      Below is a short walkthrough showing how teams go from raw
                      signals to strategic market actions.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right: Modern Geometric Image Frame (Restored Aspect Ratio) */}
            <div className="relative lg:col-span-5 xl:col-span-5">
              <FadeInRight>
                <div className="relative">
                  {/* Main Image Frame */}
                  <div className="relative overflow-hidden rounded-md border border-gray-200 bg-white p-2 shadow-2xl">
                    {/* Changed aspect-ratio back to 16/10 to reduce height */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-gray-100">
                      <Image
                        src="/images/nine.jpg"
                        alt="Life Science Pro Interface"
                        fill
                        className="object-cover transition-transform duration-1000 hover:scale-110"
                        sizes="(min-width: 1024px) 30vw, 100vw"
                      />
                    </div>
                  </div>

                  {/* Floating Context Card */}
                  <div className="absolute -bottom-6 -left-8 hidden rounded-md bg-[#025eaa] p-5 text-white shadow-xl sm:block lg:-left-12">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                          Coverage
                        </p>
                        <p className="font-outfit text-base font-bold">
                          Nordic Markets
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Outline */}
                  <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-md border border-gray-100" />
                </div>
              </FadeInRight>
            </div>
          </div>
        </div>
      </section>

      {/* LSP story */}
      <section
        id="lsp-story"
        aria-labelledby="lsp-story-heading"
        className="lg:py-25 relative scroll-mt-24 border-t border-[var(--border-color)] py-10"
      >
        {/* The heading is now handled inside StickyStory for better sticky behavior */}
        <StickyStory scenes={scenes} />
      </section>

      {/* Services */}
      <section
        id="services"
        className="scroll-mt-24 border-t border-[var(--border-color)]"
      >
        <div className="container mx-auto px-4 py-16 sm:px-8 lg:px-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-outfit text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Services for life sciences
              </h2>
              <p className="mt-2 max-w-2xl font-inter text-[var(--muted-text)]">
                From market access to supply risk: pragmatic analytics,
                dependable engineering, and explainable models.
              </p>
            </div>
          </div>

          <ServicesGridWithModal services={services} />
        </div>
      </section>

      {/* Compliance */}
      <section
        aria-labelledby="compliance-heading"
        className="border-t border-[var(--border-color)]"
      >
        <div className="container mx-auto px-6 py-16 sm:px-8 lg:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="compliance-heading"
                className="font-outfit text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              >
                Validated for regulated environments
              </h2>
              <p className="mt-2 max-w-2xl font-inter text-[var(--muted-text)]">
                Audit trails, role based access, lineage, and monitoring,
                delivered with governance that fits life science workflows.
              </p>
            </div>

            {/* TRIGGER COMPONENT */}
            <ComplianceModal />
          </div>

          {/* DATA REMAINS IN THE SECTION AS REQUESTED */}
          <ul className="mt-10 grid grid-cols-1 gap-3 font-inter text-sm text-[var(--muted-text)] sm:grid-cols-2 lg:grid-cols-3">
            {[
              "GxP aware workflows & e-record audit trails",
              "Role based access, least privilege, and encryption in transit/at rest",
              "Data lineage from source to decision surface",
              "Model explainability, drift alerts, and performance monitoring",
              "Change control with environment based deployments",
              "Validation documentation available on request",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg border border-[var(--border-color)] bg-white p-4 shadow-sm"
              >
                <span className="mr-2 text-[var(--accent-color)]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cases */}
      <section
        id="cases"
        aria-labelledby="cases-heading"
        className="border-t border-[var(--border-color)]"
      >
        <div className="container mx-auto px-6 py-16 sm:px-8 lg:px-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2
                id="cases-heading"
                className="font-outfit text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              >
                Selected work
              </h2>
              <p className="mt-2 max-w-2xl font-inter text-sm">
                Focused engagements across manufacturers, distributors, and
                animal health.
              </p>
            </div>
          </div>

          <CasesGridWithModal cases={cases} />
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="relative scroll-mt-24 overflow-hidden border-t border-gray-100 bg-white py-24 lg:py-32"
      >
        <div className="mx-auto w-full px-4 sm:px-8 lg:px-16">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            {/* Left: Content Side */}
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#025eaa]">
                  Our Identity
                </div>

                <h2
                  id="about-heading"
                  className="mt-6 font-outfit text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
                >
                  About us
                </h2>

                <p className="mt-6 max-w-3xl font-inter text-lg leading-relaxed text-gray-600">
                  CPH Analytics is an independent analytics consultancy. We help
                  lifescience teams move from raw data to confident decisions,
                  combining pragmatic strategy with dependable engineering and
                  applied AI.
                </p>

                {/* Feature Grid with Hover Lift */}
                <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    "Evidence-based, measurable outcomes",
                    "Clear roadmaps and fast iterations",
                    "Robust data pipelines & decision surfaces",
                    "Explainable models with monitoring",
                  ].map((t) => (
                    <li
                      key={t}
                      className="group relative flex items-start gap-3 rounded-md border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#025eaa] hover:shadow-md"
                    >
                      {/* Visual Anchor */}
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#025eaa] transition-all group-hover:scale-125" />
                      <span className="font-inter text-sm font-medium text-gray-700">
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <BookDemoModalTrigger
                    label="Talk to a life science data lead"
                    bookingUrl={DEMO_BOOKING_URL}
                    embedCalendly={false}
                    className="inline-flex items-center justify-center rounded-md bg-[#025eaa] px-8 py-4 font-outfit font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#014a87] active:scale-95"
                  />
                </div>
              </FadeIn>
            </div>

            {/* Right: Refined Portrait Frame */}
            <aside className="lg:col-span-5">
              <FadeInRight>
                <figure className="relative mx-auto w-full max-w-sm">
                  {/* Background Decorator */}
                  <div className="absolute -bottom-6 -right-6 h-full w-full rounded-md bg-gray-50" />

                  <div className="relative overflow-hidden rounded-md border border-gray-200 bg-white p-2 shadow-2xl">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                      <Image
                        src="/images/people/you.jpg"
                        alt="David A. Seiler-Holm Headshot"
                        fill
                        sizes="(min-width: 1024px) 400px, 80vw"
                        className="object-cover transition-transform duration-1000 hover:scale-105"
                        priority
                      />
                    </div>

                    <figcaption className="px-4 py-5 font-inter">
                      <div className="font-outfit text-base font-bold text-gray-900">
                        David A. Seiler-Holm
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#025eaa]">
                        <span className="h-px w-4 bg-[#025eaa]" />
                        Managing Partner
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </FadeInRight>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact band */}
      <section
        aria-labelledby="contact-heading"
        className="relative scroll-mt-24 overflow-hidden border-t border-gray-100 bg-white py-12 lg:py-16"
      >
        {/* Subtle technical background accent */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-40 [background-size:32px_32px]" />

        <div className="mx-auto w-full px-4 sm:px-8 lg:px-16">
          {/* Reduced internal padding from p-20 to p-10 */}
          <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-blue-900/5 sm:p-12">
            {/* Decorative Brand Anchor - Top Center */}
            <div className="absolute left-1/2 top-0 h-1 w-20 -translate-x-1/2 bg-[#025eaa]" />

            <FadeIn>
              <h2
                id="contact-heading"
                className="font-outfit text-4xl font-bold tracking-tight text-gray-900 md:text-4xl"
              >
                Ready to turn signals into outcomes?
              </h2>

              {/* Reduced margin and text size for a tighter look */}
              <p className="mx-auto mt-4 max-w-xl font-inter text-base text-gray-600">
                Speak with a senior consultant about your roadmap, pricing, and
                analytics for life science teams.
              </p>

              {/* Tightened gap between buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 font-outfit sm:flex-row">
                <BookDemoModalTrigger
                  label="Book a demo"
                  bookingUrl={DEMO_BOOKING_URL}
                  embedCalendly={false}
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#025eaa] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#014a87] active:scale-95 sm:w-auto"
                />

                <BookConsultationModalTrigger
                  label="Request Consultation"
                  title="Request Consultation"
                  className="inline-flex w-full items-center justify-center rounded-md border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:-translate-y-1 hover:border-[#025eaa] hover:text-[#025eaa] active:scale-95 sm:w-auto"
                />
              </div>

              {/* Reduced margin for footer area */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="font-inter text-xs font-medium text-gray-500">
                  Already a client?{" "}
                  <a
                    href="https://lsp.cphanalytics.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center font-bold text-[#025eaa] transition-opacity hover:opacity-70"
                  >
                    Client Login
                    <svg
                      className="ml-1 h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
