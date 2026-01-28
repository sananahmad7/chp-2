"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
      {/* 1. Header Trigger - Minimalist Text Link */}
      <div className="absolute -top-16 right-0 sm:-top-20">
        <button
          onClick={() => setAllOpen(true)}
          className="text-xs font-bold uppercase tracking-widest text-[#025eaa] transition-all hover:opacity-70 sm:inline-block"
        >
          View Full Archive →
        </button>
      </div>

      {/* 2. Main Grid - High Contrast "Precision" Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {cases.slice(0, 3).map((c) => (
          <article
            key={c.title}
            className="group relative flex flex-col rounded-md border border-slate-200 bg-white shadow-sm transition-all hover:border-[#025eaa] hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[calc(0.375rem-1px)]">
              <Image
                src={c.image.src}
                alt={c.image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/10 transition-opacity group-hover:opacity-0" />
            </div>

            <div className="relative flex flex-1 flex-col p-7">
              {/* Interactive Anchor */}
              <div className="absolute left-0 top-7 h-6 w-1 bg-[#025eaa] transition-all duration-300 group-hover:h-10" />

              <h3 className="font-outfit text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#025eaa]">
                {c.title}
              </h3>
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
                {c.summary}
              </p>

              <div className="mt-auto pt-8">
                <button
                  onClick={() => openModal(c)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#025eaa] transition-opacity hover:opacity-70"
                >
                  Read Investigation →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 3. VIEW ALL CASES MODAL */}
      <AnimatePresence>
        {allOpen && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={closeModal}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-8">
                <h2 className="font-outfit text-3xl font-bold text-slate-900">
                  Case Archive
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-900"
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cases.map((c) => (
                    <button
                      key={c.title}
                      onClick={() => openModal(c)}
                      className="flex flex-col items-start rounded-md border border-slate-200 bg-white p-6 text-left transition-all hover:border-[#025eaa] hover:shadow-lg"
                    >
                      <span className="font-outfit font-bold text-slate-900">
                        {c.title}
                      </span>
                      <span className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {c.summary}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. INDIVIDUAL CASE DETAIL MODAL */}
      <AnimatePresence>
        {open && active && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-lg"
              onClick={closeModal}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl"
            >
              {/* Reduced image height from h-56 to h-40 */}
              <div className="relative h-40 w-full">
                <Image
                  src={active.image.src}
                  alt={active.image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Reduced vertical padding from p-10 to p-8 */}
              <div className="p-8 pt-4">
                <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] text-[#025eaa]">
                  Case Investigation
                </span>
                <h2 className="mt-2 font-outfit text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                  {active.title}
                </h2>

                {/* Reduced gap between sections from mt-10 to mt-6 */}
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="font-outfit text-xs font-bold uppercase tracking-widest text-slate-400">
                      Project Background
                    </h4>
                    <p className="mt-2 font-inter text-base leading-relaxed text-slate-700">
                      {active.details}
                    </p>
                  </div>

                  {/* Tightened the impact box padding */}
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-6">
                    <h4 className="font-outfit text-xs font-bold uppercase tracking-widest text-[#025eaa]">
                      Measurable Impact
                    </h4>
                    <p className="mt-2 font-outfit text-lg font-bold leading-snug text-slate-900">
                      {active.impact}
                    </p>
                  </div>
                </div>

                {/* Reduced margin from mt-12 to mt-8 */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setAllOpen(true);
                    }}
                    className="text-xs font-bold uppercase tracking-widest text-[#025eaa] transition-opacity hover:opacity-70"
                  >
                    ← Back to Archive
                  </button>
                  <button
                    onClick={closeModal}
                    className="rounded-md bg-slate-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
                  >
                    Close Study
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
