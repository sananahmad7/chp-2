// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

import HeroVideo from "@/components/HeroVideo";
import BookDemoModalTrigger from "@/components/BookDemoModalTrigger";
import type { Scene } from "@/components/story/StickyStory";

/* -----------------------------------------------------------------------------
 * SEO
 * --------------------------------------------------------------------------- */

const SITE_NAME = "CPH Analytics";
const SITE_DESCRIPTION =
    "Pricing, tenders, sell‑out and shortage signals for Nordic life sciences—traceable, explainable, and built for regulated workflows.";

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
            <div className="h-full rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.25)]" />
        </div>
    );
}

/**
 * IMPORTANT:
 * This should be your marketing-first right panel:
 * - no SWR
 * - no /api calls
 * - no "0 packs" / "— SKUs"
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
        <div className="mx-auto max-w-7xl px-6 py-24 text-center text-[var(--muted-text)]">
            Loading story…
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
        body:
            "See launches, withdrawals, and back‑on‑market items as they appear across Nordic free‑pricing chains. Track adoption by country and chain, with ATC codes and pack (Vnr/EAN) context. Keep an audit trail via source‑linked observations.",
        media: {
            src: "/images/story/01-lead.jpg",
            alt: "Nordic chain adoption view with ATC tags highlighting new and back‑on‑market SKUs",
        },
    },
    {
        id: "shortage",
        kicker: "Shortage Risk",
        title: "Shortage risk for the next period",
        body:
            "Detect SKUs with a high likelihood of shortage next period—using availability patterns, abrupt price moves, and pack updates. Scores are explainable and flagged at SKU–chain–country granularity.",
        media: {
            src: "/images/story/02-shortage.jpg",
            alt: "Shortage early‑warning list with explainable risk scores and drivers",
        },
    },
    {
        id: "signal",
        kicker: "Price Signals",
        title: "Price shifts & supply tension",
        body:
            "Surface changes with last‑checked timestamps and chain coverage. Combine with shortage risk to separate scarcity from deliberate repositioning and to size expected elasticity by pack.",
        media: {
            src: "/images/story/03-signal.jpg",
            alt: "Charts showing retail price deltas with supply‑tension indicators and last‑checked timestamps",
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
            alt: "Scenario comparison with win probability and turnover curves for A‑price bids",
        },
    },
    {
        id: "outcomes",
        kicker: "Measured Impact",
        title: "From signal to measured action",
        body:
            "Ship a price or allocation change and track outcomes—turnover, share, and tender effects—so your next cycle starts with evidence, not guesswork.",
        media: {
            src: "/images/story/05-outcomes.jpg",
            alt: "Dashboard tracking KPI impact after pricing and availability changes at pack level",
        },
    },
] satisfies Scene[];

const pillars = [
    {
        title: "Pricing visibility that stands up to scrutiny",
        body:
            "Source‑linked observations, last‑checked timestamps, and a clear trail from input to decision surface—designed for regulated teams.",
    },
    {
        title: "Tender and scenario support (where applicable)",
        body:
            "Compare bid options with transparent assumptions and outputs you can share internally—so decisions are explainable and reproducible.",
    },
    {
        title: "Shortage signals that your team can act on",
        body:
            "Early warnings with drivers and granularity aligned to how teams operate: SKU / pack / chain / country.",
    },
] as const;

const services = [
    {
        title: "Market Access & Pricing",
        body:
            "Model tender scenarios, manage price corridors, and support pricing cycles with explainable recommendations.",
        href: "/life-sciences/market-access-pricing",
    },
    {
        title: "Commercial Analytics",
        body:
            "Brand performance, launch tracking, and KAM-ready insights across Nordic free‑pricing chains.",
        href: "/life-sciences/commercial-analytics",
    },
    {
        title: "Supply & Shortages",
        body:
            "Predict stock‑outs, monitor shortage signals, and drive proactive allocation with auditable rationale.",
        href: "/life-sciences/supply-shortages",
    },
    {
        title: "Evidence & Safety",
        body:
            "AI‑assisted screening (PICO/PRISMA), RWE/HEOR support, and auditable reviews with rationale.",
        href: "/life-sciences/evidence-safety",
    },
] as const;

const cases = [
    {
        title: "A‑price tender simulator (Denmark)",
        summary:
            "Compared bid options by win probability, expected turnover, and margin using competitive price distributions.",
        impact: "Better decisions without unnecessary margin erosion.",
        href: "/work/a-price-simulator",
        image: {
            src: "/images/work/a-price.jpg",
            alt: "A‑price tender simulator dashboard",
        },
    },
    {
        title: "Shortage early‑warning for distributor",
        summary:
            "Signals for shortages and returns across regions and vendors with SKU‑level explainability.",
        impact: "Faster interventions and fewer stock‑outs.",
        href: "/work/shortage-early-warning",
        image: {
            src: "/images/work/shortage-warning.jpg",
            alt: "Supply risk monitoring view with shortage drivers",
        },
    },
    {
        title: "Veterinary price intelligence (SE/NO)",
        summary:
            "Continuous price checks across pharmacy chains with traceability and last‑checked timestamps.",
        impact: "Clear pricing corridors and improved compliance across assortments.",
        href: "/work/vet-pricing-intelligence",
        image: {
            src: "/images/work/vet-pricing.jpg",
            alt: "Vet price intelligence dashboard for Sweden and Norway",
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
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                    {title}
                </h2>
                {subtitle ? <p className="mt-2 max-w-2xl text-[var(--muted-text)]">{subtitle}</p> : null}
            </div>

            {ctaHref && ctaText ? (
                <Link
                    href={ctaHref}
                    className="hidden text-[var(--accent-color)] underline decoration-[var(--accent-color)] underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] sm:inline"
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
            {/* HERO */}
            <section aria-labelledby="hero-heading" className="relative isolate min-h-[88vh] overflow-hidden">
                <HeroVideo
                    poster="/video/lsp-hero-poster.webp"
                    sources={[
                        { src: "/video/lsp-hero.webm", type: "video/webm" },
                        { src: "/video/lsp-hero.mp4", type: "video/mp4" },
                    ]}
                    className="scale-[1.36]"
                    objectPosition="center 85%"
                />

                {/* Readability scrim above video but below content */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,51,0.48))]"
                />

                <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 sm:px-8 md:pt-32 md:pb-32">
                    <div
                        className="grid min-h-[clamp(480px,64vh,720px)] items-stretch gap-8 lg:grid-cols-12"
                        style={heroGridStyle}
                    >
                        {/* Left: value prop */}
                        <div className="lg:col-span-7 xl:col-span-6 lg:min-h-[var(--hero-card-h)]">
                            <div className="relative flex h-full max-w-2xl flex-col rounded-2xl bg-white/5 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm">
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
                                    Clear signals for pricing, tenders, and supply risk—delivered with traceability and explainability
                                    that regulated teams can trust.
                                </p>

                                {/* Strong marketing bullets (no fake metrics) */}
                                <ul className="mt-6 space-y-2 text-sm text-white/80">
                                    <li>• Source‑linked observations and audit‑friendly exports</li>
                                    <li>• Scenario support for pricing/tender decisions (where applicable)</li>
                                    <li>• Shortage signals with explainable drivers</li>
                                </ul>

                                <div className="mt-7 flex flex-wrap items-center gap-4">
                                    <BookDemoModalTrigger
                                        label="Book a demo"
                                        bookingUrl={DEMO_BOOKING_URL}
                                        embedCalendly={false}
                                        className="inline-flex items-center rounded-full bg-[var(--primary-color)] px-6 py-[0.85rem] text-base font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-black/30"
                                    />

                                    <a
                                        href="#lsp-story-heading"
                                        className="inline-flex items-center text-white/90 underline decoration-white/50 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                    >
                                        See the platform story →
                                    </a>
                                </div>

                                <div className="mt-auto pt-6">
                                    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/75">
                                        <li>Nordic coverage</li>
                                        <li className="hidden sm:inline">•</li>
                                        <li>Traceable signals</li>
                                        <li className="hidden sm:inline">•</li>
                                        <li>ISO 27001 / GDPR‑ready</li>
                                    </ul>
                                </div>

                                <p className="sr-only">
                                    Background shows an aerial of Copenhagen, signaling a high-level overview for decision-making.
                                </p>
                            </div>
                        </div>

                        {/* Right: marketing-first map panel (client-only) */}
                        <div className="relative mt-6 lg:col-span-5 xl:col-span-6 lg:mt-0 lg:min-h-[var(--hero-card-h)]">
                            <HeroRightMap initialCountry="DK" className="h-full w-full" />
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
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
                                <span className="sr-only">Scroll to learn what’s inside the platform</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars */}
            <section aria-labelledby="pillars-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <SectionHeader
                        title="Built for regulated life‑science teams"
                        subtitle="A marketing homepage shouldn’t pretend to be a live dashboard. Instead: show coverage, capability, and why you’re credible."
                    />
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {pillars.map((p) => (
                            <article key={p.title} className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-6">
                                <h3 className="text-lg font-medium text-[var(--text-color)]">{p.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-[var(--muted-text)]">{p.body}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-10 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-8">
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <h3 className="text-xl font-semibold tracking-tight text-[var(--text-color)]">
                                    Want a concrete walkthrough for your market?
                                </h3>
                                <p className="mt-2 text-[var(--muted-text)]">
                                    We’ll show what’s covered, how signals are derived, and how traceability works end-to-end.
                                </p>
                            </div>
                            <div className="lg:col-span-4 lg:text-right">
                                <BookDemoModalTrigger
                                    label="Request a walkthrough"
                                    bookingUrl={DEMO_BOOKING_URL}
                                    embedCalendly={false}
                                    className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LSP intro */}
            <section aria-labelledby="lsp-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <div className="grid items-start gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <h2 id="lsp-heading" className="text-2xl font-semibold tracking-tight text-[var(--text-color)] md:text-3xl">
                                Pharma insights with Life Science Pro
                            </h2>
                            <p className="mt-4 max-w-3xl text-[var(--muted-text)]">
                                Track Nordic moves—launches, withdrawals, returns, supply gaps, and retail price shifts—plus next‑period
                                shortage risk—across free‑pricing chains for human and veterinary products. Sales data is available in Denmark.
                            </p>
                            <p className="mt-6 text-sm text-[var(--muted-text)]">
                                Below is a short story showing how teams go from signals to actions.
                            </p>
                        </div>

                        <div className="lg:col-span-5">
                            <figure className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                                <div className="relative aspect-[16/10] w-full">
                                    <Image
                                        src="/images/solutions/life-science-pro.jpg"
                                        alt="Illustrative Life Science Pro overview with ATC and pack context"
                                        fill
                                        sizes="(min-width: 1024px) 40vw, 100vw"
                                        className="object-cover"
                                    />
                                </div>
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

            {/* Services */}
            <section aria-labelledby="services-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <SectionHeader
                        title="Services for life sciences"
                        subtitle="From market access to supply risk: pragmatic analytics, dependable engineering, and explainable models."
                        ctaHref="/life-sciences"
                        ctaText="Explore services"
                    />

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

            {/* Compliance */}
            <section aria-labelledby="compliance-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <SectionHeader
                        title="Validated for regulated environments"
                        subtitle="Audit trails, role‑based access, lineage, and monitoring—delivered with governance that fits life‑science workflows."
                        ctaHref="/life-sciences/compliance"
                        ctaText="Read compliance"
                    />

                    <ul className="mt-10 grid grid-cols-1 gap-3 text-sm text-[var(--muted-text)] sm:grid-cols-2 lg:grid-cols-3">
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
                </div>
            </section>

            {/* Cases */}
            <section aria-labelledby="cases-heading" className="border-t border-[var(--border-color)]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
                    <SectionHeader
                        title="Selected work"
                        subtitle="Focused engagements across manufacturers, distributors, and animal health."
                        ctaHref="/work"
                        ctaText="View all"
                    />

                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {cases.map((c, idx) => (
                            <article
                                key={c.title}
                                className="group overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface)]"
                            >
                                <div className="relative aspect-[16/9] w-full overflow-hidden">
                                    <Image
                                        src={c.image.src}
                                        alt={c.image.alt}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, 100vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        priority={idx === 0}
                                    />
                                </div>

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

            {/* About */}
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
                                {[
                                    "Evidence‑based, measurable outcomes",
                                    "Clear roadmaps and fast iterations",
                                    "Robust data pipelines & decision surfaces",
                                    "Explainable models with monitoring",
                                ].map((t) => (
                                    <li key={t} className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                        • {t}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                <BookDemoModalTrigger
                                    label="Talk to a life‑science data lead"
                                    bookingUrl={DEMO_BOOKING_URL}
                                    embedCalendly={false}
                                    className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                />
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
                            <BookDemoModalTrigger
                                label="Book a demo"
                                bookingUrl={DEMO_BOOKING_URL}
                                embedCalendly={false}
                                className="inline-flex items-center rounded-md bg-[var(--primary-color)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                            />

                            <Link
                                href="/solutions/life-science-pro"
                                className="inline-flex items-center rounded-md px-5 py-3 text-[var(--text-color)] ring-1 ring-[var(--border-color)] transition hover:ring-[var(--gray-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                            >
                                Explore the platform
                            </Link>
                        </div>

                        <p className="mt-4 text-sm text-[var(--muted-text)]">
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
