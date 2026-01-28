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
      {/* 1. Header Trigger - Minimalist Text Link */}
      <div className="absolute -top-16 right-0 sm:-top-20">
        <button
          onClick={() => setAllOpen(true)}
          className="text-xs font-bold uppercase tracking-widest text-[#025eaa] transition-all hover:opacity-70 sm:inline-block"
        >
          View All Services →
        </button>
      </div>

      {/* 2. Main Grid - Asymmetric "L-Frame" Design */}
      <div className="grid grid-cols-1 gap-px border-y border-slate-100 bg-slate-100 md:grid-cols-2 lg:grid-cols-4">
        {services.slice(0, 4).map((s) => (
          <article
            key={s.title}
            className="group relative flex flex-col bg-white p-8 transition-all hover:z-10 hover:shadow-2xl hover:shadow-blue-900/10"
          >
            {/* Interactive Brand Anchor Line */}
            <div className="absolute left-0 top-8 h-8 w-1 bg-[#025eaa] transition-all duration-500 group-hover:h-12" />

            <h3 className="font-outfit text-xl font-bold leading-tight text-gray-900">
              {s.title}
            </h3>

            <p className="mt-6 text-sm leading-relaxed text-gray-600">
              {s.body}
            </p>

            <div className="mt-auto pt-10">
              <button
                onClick={() => openModal(s)}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#025eaa]"
              >
                <span>Discover Details</span>
                <svg
                  className="h-3 w-3 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* 3. EXPLORE ALL SERVICES MODAL - Dashboard Style */}
      {allOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-5xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <h2 className="font-outfit text-3xl font-bold text-slate-900">
                All Solutions
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto bg-slate-50/50 p-8">
              <div className="grid gap-px bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => openModal(s)}
                    className="flex flex-col items-start bg-white p-8 text-left transition-all hover:bg-slate-50"
                  >
                    <span className="font-outfit font-bold text-gray-900">
                      {s.title}
                    </span>
                    <span className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-600">
                      {s.body}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. INDIVIDUAL SERVICE DETAIL MODAL - Refined High-Contrast */}
      {open && active && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl">
            <div className="flex items-start justify-between p-10">
              <div>
                <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] text-[#025eaa]">
                  Detailed Capability
                </span>
                <h2 className="mt-4 font-outfit text-3xl font-bold text-slate-900 sm:text-4xl">
                  {active.title}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 transition-colors hover:text-slate-900"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-10 pb-10">
              <div className="space-y-12">
                <p className="font-inter text-xl leading-relaxed text-slate-700">
                  {active.details}
                </p>
                <div className="rounded-md border border-slate-200 bg-gray-50 p-8">
                  <h4 className="font-outfit text-xs font-bold uppercase tracking-widest text-slate-400">
                    Core Expertise
                  </h4>
                  <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                    {active.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-sm font-medium text-slate-600"
                      >
                        <span className="mt-2 h-1 w-4 shrink-0 rounded-full bg-[#025eaa]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-10">
                <button
                  onClick={() => {
                    setOpen(false);
                    setAllOpen(true);
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-[#025eaa] transition-opacity hover:opacity-70"
                >
                  Back to Catalog
                </button>
                <button
                  onClick={closeModal}
                  className="rounded-md bg-slate-900 px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
                >
                  Close Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
