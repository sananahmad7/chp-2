"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Case = {
  title: string;
  summary: string;
  details: string;
  impact: string;
  href: string;
  image: { src: string; alt: string };
};

export default function CasesGridWithModal({
  cases,
}: {
  cases: readonly Case[];
}) {
  const [open, setOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [active, setActive] = useState<Case | null>(null);

  const openModal = (item: Case) => {
    setActive(item);
    setOpen(true);
    setAllOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
    setAllOpen(false);
  };

  useEffect(() => {
    if (!open && !allOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, allOpen]);

  return (
    <div className="relative font-inter">
      {/* 1. Header Trigger */}
      <div className="absolute -top-16 right-0 sm:-top-20">
        <button
          onClick={() => setAllOpen(true)}
          className="decoration-[var(--accent-color)]/30 hidden text-sm font-semibold text-[var(--accent-color)] underline underline-offset-8 transition-all hover:decoration-[var(--accent-color)] sm:inline-block"
        >
          View all cases →
        </button>
      </div>

      {/* 2. Main Grid - Shows only first 3 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cases.slice(0, 3).map((c, idx) => (
          <article
            key={c.title}
            className="group overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface)] shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={c.image.src}
                alt={c.image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-medium tracking-wide text-[var(--text-color)]">
                {c.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted-text)]">
                {c.summary}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => openModal(c)}
                  className="decoration-[var(--accent-color)]/30 text-sm font-semibold text-[var(--accent-color)] underline underline-offset-4 hover:decoration-[var(--accent-color)]"
                >
                  Read the case →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 3. VIEW ALL CASES MODAL */}
      {allOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                Selected Case Studies
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                  <button
                    key={c.title}
                    onClick={() => openModal(c)}
                    className="flex flex-col items-start rounded-xl border border-slate-100 p-4 text-left transition-all hover:bg-slate-50"
                  >
                    <span className="font-display font-bold tracking-wide text-slate-900">
                      {c.title}
                    </span>
                    <span className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {c.summary}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. INDIVIDUAL CASE DETAIL MODAL */}
      {open && active && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="relative h-48 w-full">
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            </div>

            <div className="p-8 pt-0">
              <div className="flex items-start justify-between">
                <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                  {active.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-full p-2 hover:bg-slate-100"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-display text-xs font-bold uppercase tracking-wide text-[var(--accent-color)]">
                    Background
                  </h4>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {active.details}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wide text-slate-500">
                    The Impact
                  </h4>
                  <p className="mt-2 font-medium text-slate-900">
                    {active.impact}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex justify-end border-t border-slate-100 pt-8">
                <button
                  onClick={() => {
                    setOpen(false);
                    setAllOpen(true);
                  }}
                  className="mr-auto text-sm font-semibold text-[var(--accent-color)]"
                >
                  ← View all cases
                </button>
                <button
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
