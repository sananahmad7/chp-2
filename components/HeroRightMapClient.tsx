"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";

/* -------------------------------------------------------------------------- */
/* Types + copy                                                                */
/* -------------------------------------------------------------------------- */

type Country = "DK" | "SE" | "NO" | "FI" | "IS";

const COUNTRIES: Country[] = ["DK", "SE", "NO", "FI", "IS"];

const COUNTRY_NAME: Record<Country, string> = {
    DK: "Denmark",
    SE: "Sweden",
    NO: "Norway",
    FI: "Finland",
    IS: "Iceland",
};

function isCountry(x: string | null): x is Country {
    return x === "DK" || x === "SE" || x === "NO" || x === "FI" || x === "IS";
}

/**
 * Keep this SHORT. This is a hero component.
 * The left hero already sells. This only adds “coverage” clarity.
 */
const MARKET: Record<Country, { name: string; short: string; chips: string[]; note: string }> = {
    DK: {
        name: "Denmark",
        short: "Pricing + tender context + shortage signals",
        chips: ["Pricing", "Tenders", "Shortage risk"],
        note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
    },
    SE: {
        name: "Sweden",
        short: "Pricing + availability + shortage signals",
        chips: ["Pricing", "Availability", "Shortage risk"],
        note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
    },
    NO: {
        name: "Norway",
        short: "Pricing shifts + supply signals",
        chips: ["Pricing", "Supply signals", "Traceability"],
        note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
    },
    FI: {
        name: "Finland",
        short: "Pricing + supply signals with traceability",
        chips: ["Pricing", "Supply signals", "Traceability"],
        note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
    },
    IS: {
        name: "Iceland",
        short: "Scope check on request",
        chips: ["Scope check", "Traceability", "Signals"],
        note: "Coverage depends on available sources. Request a scope check and we’ll confirm what’s included.",
    },
};

/* -------------------------------------------------------------------------- */
/* Inline SVG map (client enhanced)                                            */
/* -------------------------------------------------------------------------- */

function ClickableNordics({
                              active,
                              onSelect,
                              onReady,
                              className = "",
                              shiftPercent = -6,
                              shiftYPercent = -4,
                              paddingPercent = 4,
                              showInsetFrame = false,
                              src = "/maps/nordics.svg",
                              svgMarkup,

                              /** Selected/focus accent (RGB triplet string "r,g,b") */
                              accentRgb = "56,189,248",
                              selectedAlpha = 0.30,

                              /** Selected edge */
                              strokeAlpha = 0.85,
                              selectedStrokeWidth = 1.5,

                              /** Neutral hover (not blue) */
                              hoverRgb = "255,255,255",
                              hoverFillAlpha = 0.14,
                              hoverStrokeAlpha = 0.50,
                              hoverGlowAlpha = 0.12,
                              hoverStrokeWidth = 1.25,

                              ariaControlsId,
                          }: {
    active: Country;
    onSelect: (c: Country) => void;
    onReady?: () => void;
    className?: string;
    shiftPercent?: number;
    shiftYPercent?: number;
    paddingPercent?: number;
    showInsetFrame?: boolean;
    src?: string;
    svgMarkup?: string;

    accentRgb?: string;
    selectedAlpha?: number;
    strokeAlpha?: number;
    selectedStrokeWidth?: number;

    hoverRgb?: string;
    hoverFillAlpha?: number;
    hoverStrokeAlpha?: number;
    hoverGlowAlpha?: number;
    hoverStrokeWidth?: number;

    ariaControlsId?: string;
}) {
    const hostRef = useRef<HTMLDivElement | null>(null);

    // Mount the SVG once (avoid re-fetching on every selection)
    useEffect(() => {
        let cancelled = false;
        const cleanups: Array<() => void> = [];

        async function mount() {
            const host = hostRef.current;
            if (!host) return;

            // Prefer provided markup, else fetch from /public
            if (!host.querySelector("svg")) {
                if (svgMarkup) {
                    host.innerHTML = svgMarkup;
                } else {
                    const res = await fetch(src);
                    const markup = await res.text();
                    if (cancelled) return;
                    host.innerHTML = markup;
                }
            }

            const svg = host.querySelector("svg") as SVGSVGElement | null;
            if (!svg) return;

            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

            // Tight viewBox from country bboxes (best-effort)
            const boxes: Partial<Record<Country, DOMRect>> = {};
            COUNTRIES.forEach((code) => {
                const el = svg.querySelector<SVGGraphicsElement>(`#${code}`);
                if (el) boxes[code] = el.getBBox();
            });

            const have = COUNTRIES.filter((c) => boxes[c]);
            if (have.length >= 3) {
                const rects = have.map((c) => boxes[c]!);
                const minX = Math.min(...rects.map((b) => b.x));
                const minY = Math.min(...rects.map((b) => b.y));
                const maxX = Math.max(...rects.map((b) => b.x + b.width));

                const mainRects = (["DK", "SE", "FI", "IS"] as Country[]).filter((c) => boxes[c]).map((c) => boxes[c]!);
                const mainlandMaxY = Math.max(...mainRects.map((b) => b.y + b.height));
                const no = boxes["NO"];
                const noMaxYClamped = no ? Math.min(no.y + no.height, mainlandMaxY) : -Infinity;
                const maxY = Math.max(mainlandMaxY, noMaxYClamped);

                const baseW = maxX - minX;
                const baseH = maxY - minY;
                const pad = Math.max(baseW, baseH) * (paddingPercent / 100);

                svg.setAttribute("viewBox", `${minX - pad} ${minY - pad} ${baseW + pad * 2} ${baseH + pad * 2}`);
            }

            // Inject styles (keep last so it wins)
            const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
            styleEl.textContent = `
        #borders * {
          cursor: pointer;
          outline: none;
          touch-action: manipulation;
          pointer-events: auto;
          fill: rgba(255,255,255,0.18) !important;
          stroke: rgba(255,255,255,0.35) !important;
          stroke-width: 1 !important;
          transition: fill .12s ease, stroke .12s ease, stroke-width .12s ease, filter .12s ease;
          filter: drop-shadow(0 6px 8px rgba(0,0,0,0.35));
          vector-effect: non-scaling-stroke;
          stroke-linejoin: round;
          stroke-linecap: round;
          paint-order: stroke fill;
        }

        svg {
          --map-accent: 56,189,248;
          --map-selected-alpha: .30;
          --map-stroke-alpha: .85;
          --map-selected-stroke-w: 1.5;

          --map-hover-rgb: 255,255,255;
          --map-hover-fill-alpha: .14;
          --map-hover-stroke-alpha: .50;
          --map-hover-glow-alpha: .12;
          --map-hover-stroke-w: 1.25;
        }

        svg[data-hover="DK"]:not([data-active-country="DK"])  #DK,  svg[data-hover="DK"]:not([data-active-country="DK"])  #DK  *,
        svg[data-hover="SE"]:not([data-active-country="SE"])  #SE,  svg[data-hover="SE"]:not([data-active-country="SE"])  #SE  *,
        svg[data-hover="NO"]:not([data-active-country="NO"])  #NO,  svg[data-hover="NO"]:not([data-active-country="NO"])  #NO  *,
        svg[data-hover="FI"]:not([data-active-country="FI"])  #FI,  svg[data-hover="FI"]:not([data-active-country="FI"])  #FI  *,
        svg[data-hover="IS"]:not([data-active-country="IS"])  #IS,  svg[data-hover="IS"]:not([data-active-country="IS"])  #IS  * {
          fill:   rgba(var(--map-hover-rgb), var(--map-hover-fill-alpha)) !important;
          stroke: rgba(var(--map-hover-rgb), var(--map-hover-stroke-alpha)) !important;
          stroke-width: var(--map-hover-stroke-w) !important;
          filter: drop-shadow(0 0 8px rgba(var(--map-hover-rgb), var(--map-hover-glow-alpha)));
        }

        svg:not([data-active-country="DK"]) #DK:hover, svg:not([data-active-country="DK"]) #DK:hover *,
        svg:not([data-active-country="SE"]) #SE:hover, svg:not([data-active-country="SE"]) #SE:hover *,
        svg:not([data-active-country="NO"]) #NO:hover, svg:not([data-active-country="NO"]) #NO:hover *,
        svg:not([data-active-country="FI"]) #FI:hover, svg:not([data-active-country="FI"]) #FI:hover *,
        svg:not([data-active-country="IS"]) #IS:hover, svg:not([data-active-country="IS"]) #IS:hover * {
          fill:   rgba(var(--map-hover-rgb), var(--map-hover-fill-alpha)) !important;
          stroke: rgba(var(--map-hover-rgb), var(--map-hover-stroke-alpha)) !important;
          stroke-width: var(--map-hover-stroke-w) !important;
          filter: drop-shadow(0 0 8px rgba(var(--map-hover-rgb), var(--map-hover-glow-alpha)));
        }

        svg[data-active-country="DK"] #DK, svg[data-active-country="DK"] #DK *,
        svg[data-active-country="SE"] #SE, svg[data-active-country="SE"] #SE *,
        svg[data-active-country="NO"] #NO, svg[data-active-country="NO"] #NO *,
        svg[data-active-country="FI"] #FI, svg[data-active-country="FI"] #FI *,
        svg[data-active-country="IS"] #IS, svg[data-active-country="IS"] #IS * {
          fill:   rgba(var(--map-accent), var(--map-selected-alpha)) !important;
          stroke: rgba(var(--map-accent), var(--map-stroke-alpha)) !important;
          stroke-width: var(--map-selected-stroke-w) !important;
        }

        #borders [tabindex]:focus-visible,
        #borders [tabindex]:focus-visible * {
          outline: none;
          stroke: rgba(var(--map-accent), 1) !important;
          stroke-width: 3 !important;
          filter: none;
        }

        @media (prefers-reduced-motion: reduce) {
          #borders * { transition: none !important; filter: none !important; }
        }

        #borders {
          transform-box: view-box;
          transform-origin: 50% 50%;
          transform: translate(${shiftPercent}%, ${shiftYPercent}%);
        }

        #IS-inset-box {
          stroke: rgba(255,255,255,0.35);
          fill: transparent;
          pointer-events: none;
          ${showInsetFrame ? "" : "display: none;"}
        }
      `;
            svg.appendChild(styleEl);

            // Apply CSS variables from props
            svg.style.setProperty("--map-accent", accentRgb);
            svg.style.setProperty("--map-selected-alpha", String(selectedAlpha));
            svg.style.setProperty("--map-stroke-alpha", String(strokeAlpha));
            svg.style.setProperty("--map-selected-stroke-w", String(selectedStrokeWidth));

            svg.style.setProperty("--map-hover-rgb", hoverRgb);
            svg.style.setProperty("--map-hover-fill-alpha", String(hoverFillAlpha));
            svg.style.setProperty("--map-hover-stroke-alpha", String(hoverStrokeAlpha));
            svg.style.setProperty("--map-hover-glow-alpha", String(hoverGlowAlpha));
            svg.style.setProperty("--map-hover-stroke-w", String(hoverStrokeWidth));

            const setHover = (code?: Country) => {
                if (code) svg.setAttribute("data-hover", code);
                else svg.removeAttribute("data-hover");
            };

            COUNTRIES.forEach((code) => {
                const el = svg.querySelector<SVGGraphicsElement>(`#${code}`);
                if (!el) return;

                el.setAttribute("tabindex", "0");
                el.setAttribute("role", "button");
                el.setAttribute("aria-label", `Select ${COUNTRY_NAME[code]} (${code})`);
                if (ariaControlsId) el.setAttribute("aria-controls", ariaControlsId);
                el.setAttribute("aria-pressed", code === active ? "true" : "false");

                const onClick = () => onSelect(code);
                const onKey = (e: KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(code);
                    }
                };
                const onEnter = () => setHover(code);
                const onLeave = () => setHover(undefined);

                el.addEventListener("click", onClick, { passive: true });
                el.addEventListener("keydown", onKey);
                el.addEventListener("pointerenter", onEnter, { passive: true });
                el.addEventListener("pointerleave", onLeave, { passive: true });

                cleanups.push(() => {
                    el.removeEventListener("click", onClick as any);
                    el.removeEventListener("keydown", onKey as any);
                    el.removeEventListener("pointerenter", onEnter as any);
                    el.removeEventListener("pointerleave", onLeave as any);
                });
            });

            svg.setAttribute("data-active-country", active);
            host.closest("[data-map-boot]")?.removeAttribute("data-map-boot");
            onReady?.();
        }

        mount();

        return () => {
            cancelled = true;
            cleanups.forEach((fn) => fn());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, svgMarkup, paddingPercent, shiftPercent, shiftYPercent, showInsetFrame]);

    // Keep selected highlight & aria-pressed in sync
    useEffect(() => {
        const svg = hostRef.current?.querySelector("svg");
        if (!svg) return;

        svg.setAttribute("data-active-country", active);
        COUNTRIES.forEach((code) => {
            const el = svg.querySelector<SVGGraphicsElement>(`#${code}`);
            if (el) el.setAttribute("aria-pressed", code === active ? "true" : "false");
        });
    }, [active]);

    // React to runtime color prop changes
    useEffect(() => {
        const svg = hostRef.current?.querySelector("svg");
        if (!svg) return;

        svg.style.setProperty("--map-accent", accentRgb);
        svg.style.setProperty("--map-selected-alpha", String(selectedAlpha));
        svg.style.setProperty("--map-stroke-alpha", String(strokeAlpha));
        svg.style.setProperty("--map-selected-stroke-w", String(selectedStrokeWidth));

        svg.style.setProperty("--map-hover-rgb", hoverRgb);
        svg.style.setProperty("--map-hover-fill-alpha", String(hoverFillAlpha));
        svg.style.setProperty("--map-hover-stroke-alpha", String(hoverStrokeAlpha));
        svg.style.setProperty("--map-hover-glow-alpha", String(hoverGlowAlpha));
        svg.style.setProperty("--map-hover-stroke-w", String(hoverStrokeWidth));
    }, [
        accentRgb,
        selectedAlpha,
        strokeAlpha,
        selectedStrokeWidth,
        hoverRgb,
        hoverFillAlpha,
        hoverStrokeAlpha,
        hoverGlowAlpha,
        hoverStrokeWidth,
    ]);

    return (
        <div
            ref={hostRef}
            className={[
                "h-full w-full",
                "flex items-center justify-center",
                "[&_svg]:h-full [&_svg]:w-auto",
                className,
            ].join(" ")}
        />
    );
}

/* -------------------------------------------------------------------------- */
/* Main component: map-first + slim bar + optional details                      */
/* -------------------------------------------------------------------------- */

export default function HeroRightMapClient({
                                               initialCountry = "DK",
                                               className = "",
                                               svgMarkup,
                                               accentRgb = "56,189,248",

                                               // kept for compatibility; ignored
                                               initialStats,
                                               variant,
                                           }: {
    initialCountry?: Country;
    className?: string;
    svgMarkup?: string;
    accentRgb?: string;
    initialStats?: unknown;
    variant?: "frame" | "performativ";
}) {
    const [country, setCountry] = useState<Country>(initialCountry);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const regionId = useId();

    // Read ?country=SE on first load (static friendly)
    useEffect(() => {
        try {
            const c = new URLSearchParams(window.location.search).get("country");
            if (isCountry(c)) setCountry(c);
        } catch {
            // ignore
        }
    }, []);

    const selectCountry = (c: Country) => {
        setCountry(c);
        setDetailsOpen(false); // keep the hero compact
        try {
            const url = new URL(window.location.href);
            url.searchParams.set("country", c);
            window.history.replaceState(null, "", url.toString());
        } catch {
            // ignore
        }
    };

    const market = useMemo(() => MARKET[country] ?? MARKET.DK, [country]);

    return (
        <div className={["relative h-full w-full", className].join(" ")}>
            {/* Boot CSS for first paint; removed after SVG mounts */}
            <style suppressHydrationWarning>{`
        [data-map-boot] svg #borders * {
          fill: rgba(255,255,255,.18) !important;
          stroke: rgba(255,255,255,.35) !important;
          stroke-width: 1 !important;
        }
        [data-map-boot] svg #IS-inset-box {
          fill: transparent !important;
          stroke: rgba(255,255,255,.35) !important;
        }
      `}</style>

            {/* Card: Map (flex-1) + Slim bar (shrink-0) */}
            <div className="h-full rounded-2xl bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm overflow-hidden flex flex-col">
                {/* MAP AREA */}
                <div className="flex-1 p-3 sm:p-4">
                    <figure className="relative h-full min-h-[320px] rounded-lg overflow-hidden" data-map-boot>
                        <ClickableNordics
                            active={country}
                            onSelect={selectCountry}
                            svgMarkup={svgMarkup}
                            accentRgb={accentRgb}
                            ariaControlsId={regionId}
                        />
                        <figcaption className="sr-only">Interactive map of the Nordics. Select a country.</figcaption>
                    </figure>
                </div>

                {/* SLIM COVERAGE BAR */}
                <div
                    id={regionId}
                    role="region"
                    aria-label="Selected market coverage"
                    className="shrink-0 border-t border-white/10 bg-black/10 px-4 py-3 sm:px-5 sm:py-4"
                >
                    {/* Row 1: Coverage + Details toggle */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-[11px] font-medium text-white/70">Coverage</div>
                            <div className="mt-0.5 flex items-baseline gap-2 min-w-0">
                                <div className="text-base font-semibold tracking-tight text-white">{market.name}</div>
                                <span className="hidden sm:inline text-white/30">•</span>
                                <div className="hidden sm:block text-xs text-white/70 truncate max-w-[28ch]">
                                    {market.short}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDetailsOpen((v) => !v)}
                            aria-expanded={detailsOpen}
                            className={[
                                "rounded-full px-3 py-1 text-xs font-medium",
                                "bg-white/10 text-white/85 ring-1 ring-white/10",
                                "hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                            ].join(" ")}
                        >
                            {detailsOpen ? "Hide" : "Details"}
                        </button>
                    </div>

                    {/* Row 2: Chips + (mobile) country buttons */}
                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex flex-nowrap gap-2 overflow-x-auto pr-1">
                            {market.chips.map((t) => (
                                <span
                                    key={t}
                                    className="whitespace-nowrap rounded-full bg-black/20 px-2.5 py-1 text-[11px] text-white/80 ring-1 ring-white/10"
                                >
                  {t}
                </span>
                            ))}
                        </div>

                        {/* Mobile fallback selector */}
                        <div className="ml-auto flex gap-1.5 md:hidden">
                            {COUNTRIES.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => selectCountry(c)}
                                    aria-pressed={c === country}
                                    className={[
                                        "rounded-full px-2.5 py-1 text-xs ring-1 transition",
                                        c === country
                                            ? "bg-white/20 text-white ring-white/25"
                                            : "bg-black/10 text-white/75 ring-white/10 hover:bg-white/10 hover:text-white",
                                    ].join(" ")}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details drawer (progressive disclosure) */}
                    {detailsOpen ? (
                        <div className="mt-3 rounded-lg bg-black/10 ring-1 ring-white/10 px-3 py-2">
                            <p className="text-[12px] leading-5 text-white/75">{market.note}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <Link
                                    href="/contact?topic=life-sciences"
                                    className="text-sm text-white underline decoration-white/30 underline-offset-4 hover:text-white"
                                >
                                    Request scope / walkthrough →
                                </Link>
                                <a
                                    href="#lsp-story-heading"
                                    className="text-sm text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
                                >
                                    Platform story →
                                </a>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
