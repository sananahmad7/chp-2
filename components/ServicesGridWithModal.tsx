"use client";

import { useEffect, useRef, useState } from "react";

type Service = {
  title: string;
  body: string;
  href: string;
  details: string;
  bullets: readonly string[];
};

export default function ServicesGridWithModal({
  services,
}: {
  services: readonly Service[];
}) {
  const [open, setOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [active, setActive] = useState<Service | null>(null);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const openModal = (service: Service) => {
    setActive(service);
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
      {/* 1. Header Trigger (Internalized) */}
      <div className="absolute -top-16 right-0 sm:-top-20">
        <button
          onClick={() => setAllOpen(true)}
          className="decoration-[var(--accent-color)]/30 hidden text-sm font-semibold text-[var(--accent-color)] underline underline-offset-8 transition-all hover:decoration-[var(--accent-color)] sm:inline-block"
        >
          Explore all services →
        </button>
      </div>

      {/* 2. Main Grid - Shows only first 4 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.slice(0, 4).map((s) => (
          <article
            key={s.title}
            className="group flex flex-col rounded-2xl border border-blue-100 bg-white p-7 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
          >
            <h3 className="font-display text-xl font-bold tracking-wide text-slate-900 group-hover:text-[var(--accent-color)]">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{s.body}</p>
            <div className="mt-auto pt-6">
              <button
                onClick={() => openModal(s)}
                className="text-sm font-semibold text-[var(--accent-color)] underline underline-offset-8 transition-all hover:decoration-[var(--accent-color)]"
              >
                Learn more →
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* 3. EXPLORE ALL SERVICES MODAL */}
      {allOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 sm:px-8">
              <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                All Solutions
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
            <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => openModal(s)}
                    className="hover:border-[var(--accent-color)]/40 flex flex-col items-start rounded-xl border border-slate-100 p-5 text-left transition-all hover:bg-slate-50"
                  >
                    <span className="font-display font-bold tracking-wide text-slate-900">
                      {s.title}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {s.body}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. INDIVIDUAL SERVICE DETAIL MODAL */}
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
            <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-8">
              <div>
                <span className="font-display text-[10px] font-bold uppercase tracking-wide text-[var(--accent-color)]">
                  Service Detail
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-slate-900 sm:text-3xl">
                  {active.title}
                </h2>
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
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
            <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
              <div className="space-y-8">
                <p className="text-lg leading-relaxed text-slate-700">
                  {active.details}
                </p>
                <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wide text-slate-500">
                    Key Capabilities
                  </h4>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {active.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-color)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
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
                  View all services
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
