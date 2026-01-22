"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type Country = "DK" | "SE" | "NO" | "FI" | "IS";

type MarketCard = {
  name: string;
  headline: string;
  chips: string[];
  note: string;
};

const COUNTRIES: Country[] = ["DK", "SE", "NO", "FI", "IS"];

const COUNTRY_NAME: Record<Country, string> = {
  DK: "Denmark",
  SE: "Sweden",
  NO: "Norway",
  FI: "Finland",
  IS: "Iceland",
};

const MARKET: Record<Country, MarketCard> = {
  DK: {
    name: "Denmark",
    headline: "Pricing & tender overview with sell‑out context (DK) and shortage signals—delivered with traceability.",
    chips: ["Pricing signals", "Tender context", "Sell‑out (DK)", "Shortage risk", "Source traceability"],
    note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
  },
  SE: {
    name: "Sweden",
    headline: "Track pricing movements and supply signals across Nordic free‑pricing chains with audit‑ready outputs.",
    chips: ["Pricing signals", "Availability flags", "Status changes", "Shortage risk", "Source traceability"],
    note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
  },
  NO: {
    name: "Norway",
    headline: "Identify price shifts and supply tension with explainable drivers—built for regulated workflows.",
    chips: ["Pricing signals", "Availability flags", "Status changes", "Shortage risk", "Explainable drivers"],
    note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
  },
  FI: {
    name: "Finland",
    headline: "Nordic visibility for pricing and supply signals with governance and traceability from day one.",
    chips: ["Pricing signals", "Status changes", "Shortage risk", "Traceability", "Audit‑friendly exports"],
    note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
  },
  IS: {
    name: "Iceland",
    headline: "Coverage depends on available sources—request a scope check and we’ll confirm what’s included.",
    chips: ["Pricing signals", "Status changes", "Traceability"],
    note: "Coverage varies by chain and category. Ask for a coverage sheet for your portfolio.",
  },
};

function isCountry(x: string | null): x is Country {
  return x === "DK" || x === "SE" || x === "NO" || x === "FI" || x === "IS";
}

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

                            /** Accessibility */
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

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    async function mount() {
      const host = hostRef.current;
      if (!host) return;

      // Prefer provided markup, else fetch the SVG from /public
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

      // Tight viewBox from country bboxes (optional improvement; safe even if missing)
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

      // Interactivity
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
/* UI atoms                                                                    */
/* -------------------------------------------------------------------------- */

function GlassCard({
                     label,
                     children,
                   }: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 sm:px-4 sm:py-3 ring-1 ring-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,.22)]">
      <div className="text-[13px] font-medium text-white/90">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-black/20 px-2 py-0.5 text-[11px] text-white/80 ring-1 ring-white/10">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export default function HeroRightMapClient({
                                             initialCountry = "DK",
                                             className = "",
                                             svgMarkup,
                                             accentRgb = "56,189,248",

                                             // kept for compatibility with your old props; ignored now
                                             initialStats,
                                             variant,
                                           }: {
  initialCountry?: Country;
  className?: string;
  svgMarkup?: string;
  accentRgb?: string;

  // deprecated/ignored:
  initialStats?: unknown;
  variant?: "frame" | "performativ";
}) {
  const [country, setCountry] = useState<Country>(initialCountry);
  const regionId = useId();

  // Optional: read ?country=SE on first load (static-friendly)
  useEffect(() => {
    try {
      const c = new URLSearchParams(window.location.search).get("country");
      if (isCountry(c)) setCountry(c);
    } catch {
      // ignore
    }
  }, []);

  const syncCountryToUrl = useCallback((c: Country) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("country", c);
      window.history.replaceState(null, "", url.toString());
    } catch {
      // ignore
    }
  }, []);

  const selectCountry = useCallback(
    (c: Country) => {
      setCountry(c);
      syncCountryToUrl(c);
    },
    [syncCountryToUrl]
  );

  const market = useMemo(() => MARKET[country] ?? MARKET.DK, [country]);

  const cardVars = {
    "--kpi-gap": "0.75rem",
    "--kpi-max": "24rem",
    "--kpi-w": "min(var(--kpi-max), calc((100% - var(--kpi-gap)) / 2))",
  } as CSSProperties;

  return (
    <div className={["relative h-full w-full overflow-visible", className].join(" ")} style={cardVars}>
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

      {/* Map shell */}
      <div className="h-full rounded-2xl bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm">
        <div className="relative h-full p-3 sm:p-4">
          <figure className="relative h-full rounded-lg overflow-hidden" data-map-boot>
            <ClickableNordics
              active={country}
              onSelect={selectCountry}
              svgMarkup={svgMarkup}
              accentRgb={accentRgb}
              ariaControlsId={regionId}
            />
            <figcaption className="sr-only">
              Interactive map of the Nordics. Select a country to see coverage.
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Desktop overlay cards (match your old layout) */}
      <div
        id={regionId}
        role="region"
        aria-label="Selected market coverage"
        className="pointer-events-none absolute -top-6 left-4 right-4 z-20 hidden md:flex"
      >
        <div className="pointer-events-auto w-[var(--kpi-w)] min-w-[220px]">
          <GlassCard label="Nordic coverage">
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              {market.name}
            </div>
            <p className="mt-1 text-[11px] leading-4 text-white/70">{market.headline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {market.chips.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-6 left-4 right-4 z-20 hidden md:flex gap-3">
        <div className="pointer-events-auto flex-none w-[var(--kpi-w)] min-w-[220px]">
          <GlassCard label="What you’ll see in the platform">
            <ul className="space-y-1.5 text-[12px] leading-5 text-white/80">
              <li>• Chain‑level visibility with last‑checked timestamps</li>
              <li>• Signals with explainable drivers (not black‑box outputs)</li>
              <li>• Exports that fit pricing & tender cycles</li>
            </ul>
            <div className="mt-3">
              <a
                href="#lsp-story-heading"
                className="text-[12px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                See the platform story →
              </a>
            </div>
          </GlassCard>
        </div>

        <div className="pointer-events-auto flex-none w-[var(--kpi-w)] min-w-[220px]">
          <GlassCard label="Governance & traceability">
            <ul className="space-y-1.5 text-[12px] leading-5 text-white/80">
              <li>• Source traceability for observations</li>
              <li>• Audit‑friendly workflows and reproducible outputs</li>
              <li>• Role‑based access and GDPR‑ready operations</li>
            </ul>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="/life-sciences/compliance"
                className="text-[12px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Compliance →
              </Link>
              <Link
                href="/contact?topic=life-sciences"
                className="text-[12px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Request walkthrough →
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Mobile controls + cards */}
      <div className="mt-3 md:hidden space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => selectCountry(c)}
              className={[
                "rounded-full border px-3 py-1 text-sm",
                c === country
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-black/20 text-white/90 border-white/20",
              ].join(" ")}
              aria-pressed={c === country}
              aria-label={`Select ${COUNTRY_NAME[c]}`}
            >
              {c}
            </button>
          ))}
        </div>

        <GlassCard label="Nordic coverage">
          <div className="text-xl font-semibold tracking-tight text-white">{market.name}</div>
          <p className="mt-1 text-[12px] leading-5 text-white/75">{market.headline}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {market.chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-4 text-white/60">{market.note}</p>
        </GlassCard>

        <GlassCard label="What you’ll see in the platform">
          <ul className="space-y-1.5 text-[12px] leading-5 text-white/80">
            <li>• Chain‑level visibility with last‑checked timestamps</li>
            <li>• Signals with explainable drivers</li>
            <li>• Exports that fit pricing & tender cycles</li>
          </ul>
          <div className="mt-3">
            <a
              href="#lsp-story-heading"
              className="text-[12px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              See the platform story →
            </a>
          </div>
        </GlassCard>

        <GlassCard label="Governance & traceability">
          <ul className="space-y-1.5 text-[12px] leading-5 text-white/80">
            <li>• Source traceability</li>
            <li>• Audit‑friendly workflows</li>
            <li>• Role‑based access and GDPR‑ready operations</li>
          </ul>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/life-sciences/compliance"
              className="text-[12px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Compliance →
            </Link>
            <Link
              href="/contact?topic=life-sciences"
              className="text-[12px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Request walkthrough →
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
