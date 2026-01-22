// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import type { Scene } from "@/components/story/StickyStory";
import HeroVideo from "@/components/HeroVideo";
import React from "react"; // for CSSProperties cast
// app/layout.tsx
import "./globals.css";

function HeroRightMapSkeleton() {
    return (
        <div className="relative h-full w-full">
            {/* Softened shell to match the live map card (no outer border) */}
            <div className="h-full rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.25)]" />
        </div>
    );
}
const HeroRightMap = dynamic(() => import("@/components/HeroRightMap"), {
    ssr: false,
    loading: HeroRightMapSkeleton,
});

/* ----------------------------------------------------------------------------- */
/* SEO                                                                           */
/* ----------------------------------------------------------------------------- */
export const metadata: Metadata = {
    title: "CPH Analytics",
    description:
        "Real‑time pricing, tenders, sell‑out and shortage signals for Nordic pharma & medtech—explainable models and audit‑ready pipelines.",
    openGraph: {
        title: "CPH Analytics",
        description:
            "Real‑time pricing, tenders, sell‑out and shortage signals for Nordic pharma & medtech—explainable models and audit‑ready pipelines.",
        type: "website",
    },
};

/* ----------------------------------------------------------------------------- */
/* Dynamic components                                                            */
/* ----------------------------------------------------------------------------- */

// LSP is the story: we render scenes instead of a “sample insights” link.
const StickyStory = dynamic(() => import("@/components/story/StickyStory"), {
    ssr: false,
    loading: () => (
        <div className="mx-auto max-w-7xl px-6 py-24 text-center text-[var(--muted-text)]">
            Loading story…
        </div>
    ),
});

/* ----------------------------------------------------------------------------- */
/* Life Science Pro — story scenes                                               */
/* ----------------------------------------------------------------------------- */
const scenes: Scene[] = [
    {
        id: "lead",
        kicker: "Launches & Returns",
        title: "Launch & return dynamics across chains",
        body:
            "See launches, withdrawals, and back‑on‑market items as they appear across Nordic free‑pricing chains. Track adoption by country and chain, with ATC codes and pack (Vnr/EAN) context. Audit every observed price via a link to its source.",
        media: {
            src: "/images/story/01-lead.jpg",
            alt:
                "Nordic chain adoption view with ATC tags highlighting new and back‑on‑market SKUs",
        },
    },
    {
        id: "shortage",
        kicker: "Shortage Risk",
        title: "Shortage risk for the next period",
        body:
            "Detect SKUs with a high likelihood of shortage next period—using availability patterns, abrupt price moves, launch/return signals, and pack updates. Scores are explainable and flagged at SKU–chain–country granularity.",
        media: {
            src: "/images/story/02-shortage.jpg",
            alt:
                "Shortage early‑warning list with explainable risk scores and drivers",
        },
    },
    {
        id: "signal",
        kicker: "Price Signals",
        title: "Price shifts & supply tension",
        body:
            "Surface rapid increases or decreases with last‑checked timestamps and chain coverage. Combine with shortage risk to separate scarcity from deliberate repositioning and to size expected elasticity by pack.",
        media: {
            src: "/images/story/03-signal.jpg",
            alt:
                "Charts showing retail price deltas with supply‑tension indicators and last‑checked timestamps",
        },
    },
    {
        id: "models",
        kicker: "Scenarios",
        title: "Price scenarios that ingest shortage risk",
        body:
            "Feed shortage probability and recent deltas into scenario models. For Denmark’s sealed‑bid A‑price, compare options by win probability, expected turnover, and margin—biasing the recommendation when shortage risk is elevated.",
        media: {
            src: "/images/story/04-models.jpg",
            alt:
                "Scenario comparison: hold vs. increase with win probability and turnover curves for A‑price bids",
        },
    },
    {
        id: "outcomes",
        kicker: "Measured Impact",
        title: "From signal to measured action",
        body:
            "Ship a price or allocation change and watch the impact in a unified, daily‑refreshed sell‑out view—turnover, share, and A‑price effects—so your next cycle starts with evidence.",
        media: {
            src: "/images/story/05-outcomes.jpg",
            alt:
                "Dashboard tracking KPI impact after pricing and availability changes at pack level",
        },
    },
];

/* ----------------------------------------------------------------------------- */
/* Insight card (decorative, anchored to the device frame)                       */
/* ----------------------------------------------------------------------------- */
type InsightCardProps = {
    title: string;
    value: string;
    meta?: string;
    size?: "sm" | "md";
    className?: string;
};

function InsightCard({
                         title,
                         value,
                         meta,
                         size = "md",
                         className = "",
                     }: InsightCardProps) {
    const pad = size === "sm" ? "p-3" : "p-4";
    const text = size === "sm" ? "text-sm" : "text-base";
    const valueText = size === "sm" ? "text-xl" : "text-2xl";
    return (
        <div
            className={[
                "rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,.35)] ring-1 ring-white/10",
                "min-w-[220px] max-w-xs animate-float-slow will-change-transform",
                pad,
                className,
            ].join(" ")}
        >
            <div className={`font-medium text-white/90 ${text}`}>{title}</div>
            <div className={`mt-1 font-semibold tracking-tight text-white ${valueText}`}>
                {value}
            </div>
            {meta ? <div className="mt-1 text-xs text-white/70">{meta}</div> : null}
        </div>
    );
}

/* ----------------------------------------------------------------------------- */
/* Services & cases                                                              */
/* ----------------------------------------------------------------------------- */
const services = [
    {
        title: "Market Access & Pricing",
        body:
            "Model sealed‑bid A‑price scenarios, optimize tenders, and manage price corridors with explainable recommendations.",
        href: "/life-sciences/market-access-pricing",
    },
    {
        title: "Commercial Analytics",
        body:
            "Brand performance, launch tracking, ATC trends, and KAM/HCP insights across Nordic free‑pricing chains.",
        href: "/life-sciences/commercial-analytics",
    },
    {
        title: "Supply & Shortages",
        body:
            "Predict stock‑outs at SKU–pack level, monitor recalls & shortage signals, and drive proactive allocation.",
        href: "/life-sciences/supply-shortages",
    },
    {
        title: "Evidence & Safety",
        body:
            "AI‑assisted literature screening (PICO/PRISMA), RWE/HEOR support, and auditable reviews with rationale.",
        href: "/life-sciences/evidence-safety",
    },
];

const cases = [
    {
        title: "A‑price tender simulator (Denmark)",
        summary:
            "Compared bid options by win probability, expected turnover, and margin using competitive price distributions.",
        impact: "Higher win rates without unnecessary margin erosion.",
        href: "/work/a-price-simulator",
        image: { src: "/images/work/a-price.jpg", alt: "A‑price tender simulator dashboard" },
    },
    {
        title: "Shortage early‑warning for distributor",
        summary:
            "Near‑real‑time signals for shortages and returns across regions and vendors with SKU‑level explainability.",
        impact: "Faster interventions and fewer stock‑outs.",
        href: "/work/shortage-early-warning",
        image: { src: "/images/work/shortage-warning.jpg", alt: "Supply risk monitoring view with shortage drivers" },
    },
    {
        title: "Veterinary price intelligence (SE/NO)",
        summary:
            "Continuous price checks across 10+ pharmacy chains with source‑level traceability and last‑checked timestamps.",
        impact: "Clear pricing corridors and improved compliance across assortments.",
        href: "/work/vet-pricing-intelligence",
        image: { src: "/images/work/vet-pricing.jpg", alt: "Vet price intelligence dashboard for Sweden and Norway" },
    },
];

/* ----------------------------------------------------------------------------- */
/* Page                                                                          */
/* ----------------------------------------------------------------------------- */
export default function Home() {
    return (
        <>
            {/* HERO — fuller video + non-overlapping left card + Explore CTA */}
            <section aria-labelledby="hero-heading" className="relative isolate min-h-[88vh] overflow-hidden">
                {/* Background video (fills more; keeps the river/boat in view) */}
                <HeroVideo
                    poster="/video/lsp-hero-poster.webp"
                    sources={[
                        { src: "/video/lsp-hero.webm", type: "video/webm" },
                        { src: "/video/lsp-hero.mp4", type: "video/mp4" },
                    ]}
                    className="scale-[1.36]"          // fill more without altering section height
                    objectPosition="center 85%"        // focus lower third
                />

                {/* Readability scrim ABOVE video but BELOW content */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,51,0.48))]"
                />

                {/* Content */}
                <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 sm:px-8 md:pt-32 md:pb-32">
                    {/* Equal-height row; allows growth when copy wraps */}
                    <div
                        className="grid min-h-[clamp(480px,64vh,720px)] items-stretch gap-8 lg:grid-cols-12"
                        style={
                            {
                                ["--hero-card-h" as any]: "clamp(520px,66vh,760px)",
                            } as React.CSSProperties
                        }
                    >
                        {/* Left: value prop (glass card) */}
                        <div className="lg:col-span-7 xl:col-span-6 lg:min-h-[var(--hero-card-h)]">
                            <div className="relative flex h-full flex-col max-w-2xl rounded-2xl bg-white/5 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm">
                                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                                    <span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" aria-hidden />
                                    <Link
                                        href="/life-sciences"
                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                    >
                                        Life Sciences
                                    </Link>
                                </p>

                                <h1
                                    id="hero-heading"
                                    className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight md:leading-[1.05]"
                                >
                                    Price &amp; tender overview for Nordic pharma
                                </h1>

                                <p className="mt-5 max-w-prose text-base leading-7 text-white/85 sm:text-lg">
                                    Real‑time pricing, tenders, sell‑out and shortage signals—built for regulated markets.
                                    Explainable models with audit‑ready pipelines from CPH Analytics.
                                </p>

                                <div className="mt-7 flex flex-wrap items-center gap-4">
                                    {/* Primary CTA */}
                                    <Link
                                        href="/contact?topic=life-sciences"
                                        className="inline-flex items-center rounded-full bg-[var(--primary-color)] px-6 py-[0.85rem] text-base font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-black/30"
                                    >
                                        Book a demo
                                    </Link>

                                    {/* Secondary — scroll target */}
                                    <Link
                                        href="#lsp-story-heading"
                                        className="inline-flex items-center text-white/90 underline decoration-white/50 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                    >
                                        Explore the platform →
                                    </Link>
                                </div>

                                {/* Trust row / metrics — in flow, pinned to the bottom when space allows */}
                                <div className="mt-auto pt-6">
                                    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/75">
                                        <li>Trusted across the Nordics</li>
                                        <li className="hidden sm:inline">•</li>
                                        <li>5 markets • 12+ data pipelines</li>
                                        <li className="hidden sm:inline">•</li>
                                        <li>ISO 27001 / GDPR‑ready</li>
                                    </ul>
                                </div>

                                {/* Screen reader description of background meaning */}
                                <p className="sr-only">
                                    Background shows an aerial of Copenhagen slowly zooming out, signaling getting an overview.
                                </p>
                            </div>
                        </div>

                        {/* Right: interactive Nordics map (glass card) */}
                        <div className="relative mt-6 lg:col-span-5 xl:col-span-6 lg:mt-0 lg:min-h-[var(--hero-card-h)]">
                            <HeroRightMap initialCountry="DK" className="h-full w-full" />
                        </div>
                    </div>
                </div>

                {/* Subtle arrow nudge (static, low‑contrast) — left aligned with the text column */}
                <div className="pointer-events-none absolute inset-x-0 bottom-5 sm:bottom-7">
                    <div className="mx-auto max-w-7xl px-6 sm:px-8">
                        <div className="grid lg:grid-cols-12">
                            <div className="lg:col-span-7 xl:col-span-6 flex">
                <span
                    aria-hidden
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/15 text-white/70 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
                    <path
                        d="M5 8l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                  </svg>
                </span>
                                <span className="sr-only">Scroll to see what’s inside Life Science Pro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Credibility chips under hero (pharma‑specific) */}
            <section aria-labelledby="benefits-heading" className="border-t border-[var(--border-color)]">
                <h2 id="benefits-heading" className="sr-only">Key benefits</h2>
                <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
                    <ul className="grid grid-cols-1 gap-4 text-sm text-[var(--muted-text)] sm:grid-cols-2 md:grid-cols-4">
                        {[
                            "Daily‑refreshed Denmark sell‑out & price flags",
                            "Auction simulator for Denmark’s sealed‑bid A‑price",
                            "Veterinary price intelligence across 10+ chains (SE/NO)",
                            "AI‑assisted literature screening with PICO‑style rationale",
                        ].map((t) => (
                            <li key={t} className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* LSP intro (story down the page) */}
            <section aria-labelledby="lsp-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <div className="grid items-start gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <h2 id="lsp-heading" className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                                Pharma insights with Life Science Pro
                            </h2>
                            <p className="mt-4 max-w-3xl text-[var(--muted-text)]">
                                Track Nordic pharmaceutical moves—launches, withdrawals, returns, supply gaps, and retail price
                                shifts—plus next‑period shortage risk—across free‑pricing chains for human and veterinary products.
                                Sales data is available in Denmark.
                            </p>
                            <p className="mt-6 text-sm text-[var(--muted-text)]">Below is a short story from Life Science Pro.</p>
                        </div>
                        <div className="lg:col-span-5">
                            <figure className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                                <img
                                    src="/images/solutions/life-science-pro.jpg"
                                    alt="Illustrative Life Science Pro overview with ATC and pack context"
                                    className="h-full w-full object-cover"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            </section>

            {/* LSP story */}
            <section aria-labelledby="lsp-story-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 pt-12 sm:px-8">
                    <h3 id="lsp-story-heading" className="text-xl font-semibold tracking-tight text-[var(--text-color)] md:text-2xl">
                        Life Science Pro story
                    </h3>
                </div>
                <StickyStory scenes={scenes} />
            </section>

            {/* How we help (life‑science JTBD) */}
            <section aria-labelledby="services-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h2 id="services-heading" className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                                Built for Life Sciences
                            </h2>
                            <p className="mt-2 max-w-2xl text-[var(--muted-text)]">
                                Plug‑in services across market access, commercial, supply, and evidence—delivered with dependable
                                engineering and explainable models.
                            </p>
                        </div>
                        <Link
                            href="/life-sciences"
                            className="hidden text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] sm:inline"
                        >
                            Explore life‑science services →
                        </Link>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {services.map((s) => (
                            <article key={s.title} className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-6">
                                <h3 className="text-lg font-medium text-[var(--text-color)]">{s.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-[var(--muted-text)]">{s.body}</p>
                                <div className="mt-4">
                                    <Link
                                        href={s.href}
                                        className="text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                    >
                                        Learn more →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compliance & Data Governance */}
            <section aria-labelledby="compliance-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <h2 id="compliance-heading" className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                        Validated for regulated environments
                    </h2>
                    <p className="mt-3 max-w-3xl text-[var(--muted-text)]">
                        We operate with pharma‑grade controls: audit trails, role‑based access, data lineage, and model monitoring.
                        Alignment with 21 CFR Part 11 / EU Annex 11 where applicable, plus GDPR and DPA compliance.
                    </p>
                    <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-[var(--muted-text)] sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            "GxP‑aware workflows & e‑record audit trails",
                            "Role‑based access, least privilege, and encryption in transit/at rest",
                            "Data lineage from source to decision surface",
                            "Model explainability, drift alerts, and performance monitoring",
                            "Change control with environment‑based deployments",
                            "Validation documentation available on request",
                        ].map((item) => (
                            <li key={item} className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                • {item}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6">
                        <Link
                            href="/life-sciences/compliance"
                            className="text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                        >
                            Read our compliance overview →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Cases (life‑science forward) */}
            <section aria-labelledby="cases-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h2 id="cases-heading" className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                                Selected life‑science work
                            </h2>
                            <p className="mt-2 max-w-2xl text-[var(--muted-text)]">
                                Focused engagements across pharma manufacturers, distributors, and animal health.
                            </p>
                        </div>
                        <Link
                            href="/work"
                            className="hidden text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] sm:inline"
                        >
                            View all →
                        </Link>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {cases.map((c) => (
                            <article key={c.title} className="group overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                                {c.image ? (
                                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                                        <img
                                            src={c.image.src}
                                            alt={c.image.alt}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                ) : null}
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-[var(--text-color)]">{c.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--muted-text)]">{c.summary}</p>
                                    <p className="mt-2 text-sm text-[var(--muted-text)]">{c.impact}</p>
                                    <div className="mt-4">
                                        <Link
                                            href={c.href}
                                            className="text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                        >
                                            Read the case →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* About us with photo */}
            <section aria-labelledby="about-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <h2 id="about-heading" className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                                About us
                            </h2>
                            <p className="mt-4 max-w-3xl text-[var(--muted-text)]">
                                CPH Analytics is an independent analytics consultancy. We help life‑science teams move from raw data to
                                confident decisions—combining pragmatic strategy with dependable engineering and applied AI.
                            </p>
                            <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-[var(--muted-text)] sm:grid-cols-2">
                                <li className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                    • Evidence‑based, measurable outcomes
                                </li>
                                <li className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                    • Clear roadmaps and fast iterations
                                </li>
                                <li className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                    • Robust data pipelines & decision surfaces
                                </li>
                                <li className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                    • Explainable models with monitoring
                                </li>
                            </ul>
                            <div className="mt-6">
                                <Link
                                    href="/contact?topic=life-sciences"
                                    className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                >
                                    Talk to a life‑science data lead
                                </Link>
                            </div>
                        </div>

                        <aside className="lg:col-span-5">
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
                                <figcaption className="px-5 py-4">
                                    <div className="text-sm font-medium text-[var(--text-color)]">David A. Seiler-Holm</div>
                                    <div className="text-sm text-[var(--muted-text)]">Managing Partner</div>
                                </figcaption>
                            </figure>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Contact band */}
            <section aria-labelledby="contact-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-8 text-center sm:p-10">
                        <h2 id="contact-heading" className="text-xl font-semibold tracking-tight text-[var(--text-color)] md:text-2xl">
                            Ready to turn signals into outcomes?
                        </h2>
                        <p className="mt-3 text-[var(--muted-text)]">
                            Speak with a senior consultant about your roadmap—pricing, tenders, shortages, and sell‑out analytics for
                            life‑science teams.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <Link
                                href="/contact?topic=life-sciences"
                                className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                            >
                                Book a demo
                            </Link>
                            <Link
                                href="/solutions/life-science-pro"
                                className="inline-flex items-center rounded-md px-5 py-3 text-[var(--text-color)] ring-1 ring-[var(--border-color)] transition hover:ring-[var(--gray-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                            >
                                Explore the platform
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
