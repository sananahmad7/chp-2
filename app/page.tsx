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
        className="relative isolate min-h-[68vh] w-full overflow-y-hidden overflow-x-clip sm:min-h-[72vh] lg:min-h-[74vh]"
      >
        {/* Put video in an overflow-hidden wrapper so scaling can’t create horizontal scroll */}
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

          {/* Readability scrim */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,51,0.48))]"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-20 md:pb-14 md:pt-24">
          <div
            className="grid min-h-[clamp(380px,52vh,600px)] w-full min-w-0 max-w-full items-stretch gap-6 lg:grid-cols-12 lg:gap-8"
            style={heroGridStyle}
          >
            {/* Left */}
            <div className="min-w-0 lg:col-span-7 lg:min-h-[var(--hero-card-h)] xl:col-span-6">
              <div className="relative mt-5 flex h-full w-full min-w-0 max-w-full flex-col rounded-2xl bg-white/5 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm  sm:p-7 lg:mt-0">
                <h1
                  id="hero-heading"
                  className="mt-3 font-outfit text-4xl font-bold leading-tight text-white sm:text-6xl md:text-7xl md:leading-[1.05]"
                >
                  Price &amp; tender overview for Nordic pharma
                </h1>

                <p className="mt-4 max-w-prose font-inter text-base leading-7 text-white/80 sm:mt-5 sm:text-lg">
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

                <div className="mt-6 flex flex-wrap items-center gap-3 font-inter sm:mt-7 sm:gap-4">
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

                <div className="mt-auto pt-5 font-inter sm:pt-6">
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

            {/* Right */}
            <div className="relative mt-6 min-w-0 overflow-hidden lg:col-span-5 lg:mt-0 lg:min-h-[var(--hero-card-h)] xl:col-span-6">
              <HeroRightMap
                initialCountry="DK"
                className="h-full w-full max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section
        id="pillars"
        aria-labelledby="pillars-heading"
        className="scroll-mt-24 border-t border-[var(--border-color)] "
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <FadeIn>
            <SectionHeader
              title="Built for regulated life science teams"
              subtitle="A marketing homepage shouldn’t pretend to be a live dashboard. Instead: show coverage, capability, and why you’re credible."
            />

            <div className="mt-10 grid grid-cols-1 gap-6 font-inter md:grid-cols-3">
              {pillars.map((p) => (
                <article
                  key={p.title}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-6"
                >
                  <h3 className="font-outfit text-lg font-medium text-[var(--text-color)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 font-inter text-sm leading-6 text-[var(--muted-text)]">
                    {p.body}
                  </p>
                </article>
              ))}
            </div>
          </FadeIn>

          <div className="mt-10 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6 font-inter sm:p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h3 className="font-outfit text-xl font-semibold text-[var(--text-color)]">
                  Want a concrete walkthrough for your market?
                </h3>
                <p className="mt-2 font-inter text-[var(--muted-text)]">
                  We’ll show what’s covered, how signals are derived, and how
                  traceability works end to end.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <BookConsultationModalTrigger
                  label="Request a walkthrough"
                  title="Request a walkthrough"
                  className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LSP intro */}
      <section
        aria-labelledby="lsp-heading"
        className="border-t border-[var(--border-color)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FadeIn>
                <h2
                  id="lsp-heading"
                  className="font-outfit text-2xl font-semibold text-[var(--text-color)] md:text-3xl"
                >
                  Pharma insights with Life Science Pro
                </h2>
                <p className="mt-4 max-w-3xl font-inter text-[var(--muted-text)]">
                  Track Nordic moves, launches, withdrawals, returns, supply
                  gaps, and retail price shifts, plus next period shortage risk,
                  across free pricing chains for human and veterinary products.
                  Sales data is available in Denmark.
                </p>
                <p className="mt-6 font-inter text-sm text-[var(--muted-text)]">
                  Below is a short story showing how teams go from signals to
                  actions.
                </p>
              </FadeIn>
            </div>

            <div className="lg:col-span-5">
              <figure className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                <FadeInRight>
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="/images/one.jpg"
                      alt="Illustrative Life Science Pro overview with ATC and pack context"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>{" "}
                </FadeInRight>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* LSP story */}
      <section
        id="lsp-story"
        aria-labelledby="lsp-story-heading"
        className="scroll-mt-24 border-t border-[var(--border-color)]"
      >
        <div className="mx-auto max-w-7xl px-6 pt-12 sm:px-8">
          <h3
            id="lsp-story-heading"
            className="font-outfit text-xl font-semibold text-[var(--text-color)] md:text-2xl"
          >
            Life Science Pro story
          </h3>
        </div>
        <StickyStory scenes={scenes} />
      </section>

      {/* Services */}
      <section
        id="services"
        className="scroll-mt-24 border-t border-[var(--border-color)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-outfit text-2xl font-semibold text-[var(--text-color)] md:text-3xl">
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
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="compliance-heading"
                className="font-outfit text-2xl font-semibold text-[var(--text-color)] md:text-3xl"
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
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2
                id="cases-heading"
                className="font-outfit text-2xl font-semibold text-[var(--text-color)] md:text-3xl"
              >
                Selected work
              </h2>
              <p className="mt-2 max-w-2xl font-inter text-[var(--muted-text)]">
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
        className="scroll-mt-24 border-t border-[var(--border-color)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FadeIn>
                <h2
                  id="about-heading"
                  className="font-outfit text-2xl font-semibold text-[var(--text-color)] md:text-3xl"
                >
                  About us
                </h2>

                <p className="mt-4 max-w-3xl font-inter text-[var(--muted-text)]">
                  CPH Analytics is an independent analytics consultancy. We help
                  lifescience teams move from raw data to confident decisions,
                  combining pragmatic strategy with dependable engineering and
                  applied AI.
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-3 font-inter text-sm text-[var(--muted-text)] sm:grid-cols-2">
                  {[
                    "Evidenc based, measurable outcomes",
                    "Clear roadmaps and fast iterations",
                    "Robust data pipelines & decision surfaces",
                    "Explainable models with monitoring",
                  ].map((t) => (
                    <li
                      key={t}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4"
                    >
                      • {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 font-inter">
                  <BookDemoModalTrigger
                    label="Talk to a life science data lead"
                    bookingUrl={DEMO_BOOKING_URL}
                    embedCalendly={false}
                    className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                  />
                </div>
              </FadeIn>
            </div>

            <aside className="lg:col-span-5">
              <FadeInRight>
                <figure className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/people/you.jpg"
                      alt="Headshot"
                      fill
                      sizes="(min-width: 1024px) 320px, 60vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <figcaption className="px-5 py-4 font-inter">
                    <div className="font-outfit text-sm font-medium text-[var(--text-color)]">
                      David A. Seiler-Holm
                    </div>
                    <div className="text-sm text-[var(--muted-text)]">
                      Managing Partner
                    </div>
                  </figcaption>
                </figure>
              </FadeInRight>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact band */}
      <section
        aria-labelledby="contact-heading"
        className="border-t border-[var(--border-color)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-8 text-center sm:p-10">
            <h2
              id="contact-heading"
              className="font-outfit text-xl font-semibold text-[var(--text-color)] md:text-2xl"
            >
              Ready to turn signals into outcomes?
            </h2>

            <p className="mt-3 font-inter text-[var(--muted-text)]">
              Speak with a senior consultant about your roadmap, pricing,
              tenders, shortages, and sell out analytics for life science teams.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-4 font-inter lg:flex-row">
              <BookDemoModalTrigger
                label="Book a demo"
                bookingUrl={DEMO_BOOKING_URL}
                embedCalendly={false}
                className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
              />

              <BookConsultationModalTrigger
                label="Book a Consultation"
                title="Book a Consultation"
                className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
              />
            </div>

            <p className="mt-4 font-inter text-sm text-[var(--muted-text)]">
              Already a client?{" "}
              <a
                href="https://lsp.cphanalytics.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
              >
                Client Login →
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
