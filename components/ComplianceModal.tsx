"use client";

import { useEffect, useRef, useState } from "react";

const EXTRA_COMPLIANCE_DATA = [
  {
    category: "Audit & Logging",
    details:
      "Automated event logging for all data mutations. Logs are shipped to a central, write-once-read-many (WORM) storage to prevent tampering, ensuring a validatable chain of custody for GxP environments.",
  },
  {
    category: "Infrastructure Security",
    details:
      "Our stack runs on ISO 27001 certified data centers. We employ network-level isolation (VPCs), automated vulnerability scanning (SAST/DAST), and monthly penetration testing reports available under NDA.",
  },
  {
    category: "Disaster Recovery",
    details:
      "Recovery Point Objective (RPO) of < 1 hour and Recovery Time Objective (RTO) of < 4 hours. Daily encrypted backups are geographically redundant across multiple Nordic availability zones.",
  },
  {
    category: "Data Residency",
    details:
      "All life science data is strictly residency-locked to EU/EEA regions. No data is transferred to third countries without explicit data processing agreement (DPA) updates and impact assessments.",
  },
];

export default function ComplianceModal() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="decoration-[var(--accent-color)]/30 text-sm font-semibold text-[var(--accent-color)] underline underline-offset-8 transition-all hover:decoration-[var(--accent-color)]"
      >
        Read compliance →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-color)]">
                  Detailed Specs
                </span>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Compliance Deep-Dive
                </h2>
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8">
              <div className="space-y-8">
                {EXTRA_COMPLIANCE_DATA.map((item) => (
                  <div key={item.category} className="group">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-[var(--accent-color)]">
                      {item.category}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-700">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
              <span className="text-xs font-medium italic text-slate-400">
                Confidential Technical Specification
              </span>
              <button
                onClick={closeModal}
                className="rounded-full border border-slate-200 px-8 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
