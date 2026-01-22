"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/* Types & helpers                                                            */
/* -------------------------------------------------------------------------- */

type Country = "DK" | "SE" | "NO" | "FI" | "IS";
type HeroStats = {
  asOf: string;
  country: string;
  windowLabel: string;
  priceChanges: { totalChanged: number; increases: number; decreases: number };
  availability: { shortage: number; atRisk: number; total: number };
  status: { new: number; back: number; discontinued: number };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function fmtHM(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
}

/* -------------------------------------------------------------------------- */
/* Inline SVG map (SSR markup enhanced on client)                             */
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
                            accentRgb = "56,189,248",   // used for selected + focus
                            selectedAlpha = 0.30,       // selected fill opacity

                            /** Softer selected edge */
                            strokeAlpha = 0.85,         // outline opacity when selected
                            selectedStrokeWidth = 1.5,  // outline width when selected

                            /** Neutral HOVER (not blue) — toned down further */
                            hoverRgb = "255,255,255",   // light neutral hover (white)
                            hoverFillAlpha = 0.14,      // ↓ from .20 so hover doesn’t outshine selected
                            hoverStrokeAlpha = 0.50,    // ↓ from .65
                            hoverGlowAlpha = 0.12,      // ↓ from .20
                            hoverStrokeWidth = 1.25,    // thinner than selected edge

                            /** Accessibility: announce which KPI region is controlled by the map */
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

  /** Hover tokens */
  hoverRgb?: string;
  hoverFillAlpha?: number;
  hoverStrokeAlpha?: number;
  hoverGlowAlpha?: number;
  hoverStrokeWidth?: number;

  ariaControlsId?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const CODES: Country[] = ["DK", "SE", "NO", "FI", "IS"];

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      const host = hostRef.current;
      if (!host) return;

      // Prefer SSR markup, else fetch
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

      // Tight viewBox from country bboxes
      const boxes: Partial<Record<Country, DOMRect>> = {};
      CODES.forEach((code) => {
        const el = svg.querySelector<SVGGraphicsElement>(`#${code}`);
        if (el) boxes[code] = el.getBBox();
      });

      const have = CODES.filter((c) => boxes[c]);
      if (have.length >= 3) {
        const rects = have.map((c) => boxes[c]!);
        const minX = Math.min(...rects.map((b) => b.x));
        const minY = Math.min(...rects.map((b) => b.y));
        const maxX = Math.max(...rects.map((b) => b.x + b.width));
        const mainRects = (["DK", "SE", "FI", "IS"] as Country[])
          .filter((c) => boxes[c])
          .map((c) => boxes[c]!);
        const mainlandMaxY = Math.max(...mainRects.map((b) => b.y + b.height));
        const no = boxes["NO"];
        const noMaxYClamped = no ? Math.min(no.y + no.height, mainlandMaxY) : -Infinity;
        const maxY = Math.max(mainlandMaxY, noMaxYClamped);

        const baseW = maxX - minX;
        const baseH = maxY - minY;
        const pad = Math.max(baseW, baseH) * (paddingPercent / 100);

        svg.setAttribute(
          "viewBox",
          `${minX - pad} ${minY - pad} ${baseW + pad * 2} ${baseH + pad * 2}`
        );
      }

      // === Injected styles target element AND children =======================
      const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
      styleEl.textContent = `
        /* Neutral idle state (keeps CTA visually dominant) */
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
          /* Softer geometry on jagged outlines */
          stroke-linejoin: round;
          stroke-linecap: round;
          /* Draw stroke first so inner half sits under the fill → visually slimmer edge */
          paint-order: stroke fill;
        }

        /* Map tokens — overridden via element style properties */
        svg {
          /* Selected/focus accent (blue) */
          --map-accent: 56,189,248;
          --map-selected-alpha: .30;
          --map-stroke-alpha: .85;            /* softer edge */
          --map-selected-stroke-w: 1.5;       /* slimmer edge */

          /* Hover tokens (neutral, non-blue; toned down) */
          --map-hover-rgb: 255,255,255;
          --map-hover-fill-alpha: .14;        /* ↓ from .20 */
          --map-hover-stroke-alpha: .50;      /* ↓ from .65 */
          --map-hover-glow-alpha: .12;        /* ↓ from .20 */
          --map-hover-stroke-w: 1.25;         /* thinner than selected */
        }

        /* HOVER — neutral light (not blue) — only when hovering a NON-selected country */
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

        /* Fallback :hover — also disabled when that country is selected */
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

        /* SELECTED — keep the accent (blue by default) with softer edge */
        svg[data-active-country="DK"] #DK, svg[data-active-country="DK"] #DK *,
        svg[data-active-country="SE"] #SE, svg[data-active-country="SE"] #SE *,
        svg[data-active-country="NO"] #NO, svg[data-active-country="NO"] #NO *,
        svg[data-active-country="FI"] #FI, svg[data-active-country="FI"] #FI *,
        svg[data-active-country="IS"] #IS, svg[data-active-country="IS"] #IS * {
          fill:   rgba(var(--map-accent), var(--map-selected-alpha)) !important;
          stroke: rgba(var(--map-accent), var(--map-stroke-alpha)) !important;
          stroke-width: var(--map-selected-stroke-w) !important;
        }

        /* KEYBOARD FOCUS — high contrast */
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

        /* Position tweak */
        #borders {
          transform-box: view-box;
          transform-origin: 50% 50%;
          transform: translate(${shiftPercent}%, ${shiftYPercent}%);
        }

        /* Iceland inset */
        #IS-inset-box {
          stroke: rgba(255,255,255,0.35);
          fill: transparent;
          pointer-events: none;
          ${showInsetFrame ? "" : "display: none;"}
        }
      `;
      svg.appendChild(styleEl); // keep last so it wins

      // Set/override CSS variables from props (so parent can theme)
      svg.style.setProperty("--map-accent", accentRgb);
      svg.style.setProperty("--map-selected-alpha", String(selectedAlpha));
      svg.style.setProperty("--map-stroke-alpha", String(strokeAlpha));
      svg.style.setProperty("--map-selected-stroke-w", String(selectedStrokeWidth));

      svg.style.setProperty("--map-hover-rgb", hoverRgb);
      svg.style.setProperty("--map-hover-fill-alpha", String(hoverFillAlpha));
      svg.style.setProperty("--map-hover-stroke-alpha", String(hoverStrokeAlpha));
      svg.style.setProperty("--map-hover-glow-alpha", String(hoverGlowAlpha));
      svg.style.setProperty("--map-hover-stroke-w", String(hoverStrokeWidth));

      // Interactivity (hover & select)
      const setHover = (code?: Country) => {
        if (!svg) return;
        if (code) svg.setAttribute("data-hover", code);
        else svg.removeAttribute("data-hover");
      };

      (["DK", "SE", "NO", "FI", "IS"] as Country[]).forEach((code) => {
        const el = svg.querySelector<SVGGraphicsElement>(`#${code}`);
        if (!el) return;

        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", `${code} — filter KPIs to ${code}`);
        if (ariaControlsId) el.setAttribute("aria-controls", ariaControlsId);
        el.setAttribute("aria-pressed", code === active ? "true" : "false");

        const onClick = () => onSelect(code);
        const onKey = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(code); }
        };
        const onEnter = () => setHover(code);
        const onLeave = () => setHover(undefined);

        el.addEventListener("click", onClick, { passive: true });
        el.addEventListener("keydown", onKey);
        el.addEventListener("pointerenter", onEnter, { passive: true });
        el.addEventListener("pointerleave", onLeave, { passive: true });

        (el as any).__cleanup = () => {
          el.removeEventListener("click", onClick as any);
          el.removeEventListener("keydown", onKey as any);
          el.removeEventListener("pointerenter", onEnter as any);
          el.removeEventListener("pointerleave", onLeave as any);
        };
      });

      svg.setAttribute("data-active-country", active);
      host.closest("[data-map-boot]")?.removeAttribute("data-map-boot");
      onReady?.();
    }

    mount();

    return () => {
      cancelled = true;
      const host = hostRef.current;
      if (!host) return;
      host.querySelectorAll<SVGGraphicsElement>("#borders g").forEach((el) => {
        (el as any).__cleanup?.();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, svgMarkup, paddingPercent, shiftPercent, shiftYPercent, showInsetFrame]);

  // Keep active highlight + aria-pressed in sync
  useEffect(() => {
    const svg = hostRef.current?.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("data-active-country", active);
    (["DK", "SE", "NO", "FI", "IS"] as Country[]).forEach((code) => {
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
  }, [accentRgb, selectedAlpha, strokeAlpha, selectedStrokeWidth, hoverRgb, hoverFillAlpha, hoverStrokeAlpha, hoverGlowAlpha, hoverStrokeWidth]);

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
/* KPI tiles                                                                  */
/* -------------------------------------------------------------------------- */

function HeaderKPI({
                     total,
                     inc,
                     dec,
                     country,
                   }: {
  total?: number | string;
  inc?: number | string;
  dec?: number | string;
  country: Country;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 sm:px-4 sm:py-3 ring-1 ring-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,.22)]">
      <div className="text-[13px] font-medium text-white/90">Price changes (vs prev. period)</div>
      <div className="mt-0.5 text-xl sm:text-2xl font-semibold tracking-tight text-white">
        {total ?? "–"} SKUs
      </div>
      <div className="mt-0.5 text-[11px] text-white/70">
        ↑ {inc ?? "–"} · ↓ {dec ?? "–"} · {country} · PPP
      </div>
    </div>
  );
}

function CellKPI({ label, value, meta }: { label: string; value: string | number; meta?: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,.22)]">
      <div className="text-[13px] font-medium text-white/90">{label}</div>
      <div className="mt-0.5 text-xl font-semibold tracking-tight text-white">{value}</div>
      {meta ? <div className="mt-0.5 text-[11px] leading-4 text-white/70">{meta}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main right-hero with floating KPIs                                         */
/* -------------------------------------------------------------------------- */

export default function HeroRightMapClient({
                                             initialCountry = "DK",
                                             initialStats,
                                             variant = "performativ",
                                             className = "",
                                             svgMarkup,
                                             /** Map accent (RGB triplet string "r,g,b") */
                                             accentRgb = "56,189,248",
                                           }: {
  initialCountry?: Country;
  initialStats?: HeroStats;
  variant?: "frame" | "performativ";
  className?: string;
  svgMarkup?: string;
  accentRgb?: string;
}) {
  const [country, setCountry] = useState<Country>(initialCountry);
  const kpiRegionId = useId();

  const router = useRouter();
  const searchParams = useSearchParams();
  const setCountryAndSync = (c: Country) => {
    setCountry(c);
    const params = new URLSearchParams(searchParams.toString());
    params.set("country", c);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const { data } = useSWR<HeroStats>(`/api/hero-stats?country=${country}`, fetcher, {
    fallbackData: initialStats,
    refreshInterval: 15 * 60 * 1000,
    revalidateOnFocus: false,
  });

  const asOfLabel = useMemo(() => fmtHM(new Date(data?.asOf ?? Date.now())), [data?.asOf]);

  const totalPrice = data?.priceChanges?.totalChanged ?? "–";
  const inc = data?.priceChanges?.increases ?? "–";
  const dec = data?.priceChanges?.decreases ?? "–";
  const shortage = data?.availability?.shortage ?? 0;
  const atRisk = data?.availability?.atRisk ?? 0;
  const availTotal = shortage + atRisk;
  const stNew = data?.status?.new ?? 0;
  const stBack = data?.status?.back ?? 0;
  const stDisc = data?.status?.discontinued ?? 0;
  const statusTotal = stNew + stBack + stDisc;

  const kpiVars = {
    "--kpi-gap": "0.75rem",
    "--kpi-max": "24rem",
    "--kpi-w": "min(var(--kpi-max), calc((100% - var(--kpi-gap)) / 2))",
  } as React.CSSProperties;

  return (
    <div className={["relative h-full w-full overflow-visible", className].join(" ")} style={kpiVars}>
      {/* Boot CSS for first paint, removed by ClickableNordics when ready */}
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

      {/* CHANGED: match the text card shell → remove border & outer overflow */}
      <div className="h-full rounded-2xl bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-sm">
        <div className="relative h-full p-3 sm:p-4">
          <div className="relative h-full rounded-lg overflow-hidden" data-map-boot>
            <ClickableNordics
              active={country}
              onSelect={setCountryAndSync}
              svgMarkup={svgMarkup}
              accentRgb={accentRgb}
              ariaControlsId={kpiRegionId}
            />
            <figcaption className="sr-only">Interactive map of the Nordics. Select a country.</figcaption>
          </div>
        </div>
      </div>

      {/* Floating chips (desktop) */}
      <div
        id={kpiRegionId}
        role="region"
        aria-live="polite"
        aria-label="KPIs for selected country"
        className="pointer-events-none absolute -top-6 left-4 right-4 z-20 hidden md:flex"
      >
        <div className="pointer-events-auto w-[var(--kpi-w)] min-w-[220px]">
          <HeaderKPI total={totalPrice} inc={inc} dec={dec} country={country} />
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-6 left-4 right-4 z-20 hidden md:flex gap-3">
        <div className="pointer-events-auto flex-none w-[var(--kpi-w)] min-w-[220px]">
          <CellKPI
            label="Availability flags (current)"
            value={`${availTotal} packs`}
            meta={`${shortage} shortage · ${atRisk} at risk · as of ${asOfLabel}`}
          />
        </div>
        <div className="pointer-events-auto flex-none w-[var(--kpi-w)] min-w-[220px]">
          <CellKPI
            label={`Status changes${data?.windowLabel ? ` (${data.windowLabel})` : ""}`}
            value={`${statusTotal} packs`}
            meta={`${stNew} new · ${stBack} back · ${stDisc} discontinued`}
          />
        </div>
      </div>

      {/* Mobile country pills (neutral styling) */}
      <div className="mt-3 flex items-center gap-2 md:hidden">
        {(["DK", "SE", "NO", "FI", "IS"] as Country[]).map((c) => (
          <button
            key={c}
            onClick={() => setCountryAndSync(c)}
            className={[
              "rounded-full border px-3 py-1 text-sm",
              c === country ? "bg-white/20 text-white border-white/30" : "bg-black/20 text-white/90 border-white/20",
            ].join(" ")}
            aria-pressed={c === country}
            aria-label={`Select ${c}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
