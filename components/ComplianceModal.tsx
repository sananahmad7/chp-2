"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeModal = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-outfit text-xs font-bold uppercase tracking-[0.25em] text-[#025eaa] transition-all hover:opacity-70"
      >
        Read Technical Compliance →
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              /* Updated: Added flex layout and max-height for mobile responsiveness */
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl"
            >
              {/* Header: Fixed (flex-none) */}
              <div className="flex-none bg-[#025eaa] px-6 py-8 text-white sm:px-12 sm:py-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.4em] opacity-70">
                      Governance & Transparency
                    </span>
                    <h2 className="font-outfit text-2xl font-bold tracking-tight sm:text-4xl">
                      Compliance <br className="sm:hidden" /> Deep-Dive
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 transition-colors hover:bg-white/10 sm:h-12 sm:w-12"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="sm:h-6 sm:w-6"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content: Scrollable (flex-1) */}
              <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-12">
                <div className="space-y-10 sm:space-y-12">
                  {EXTRA_COMPLIANCE_DATA.map((item) => (
                    <div key={item.category} className="group relative">
                      <div className="absolute -left-6 top-1 h-4 w-1 bg-slate-100 transition-all group-hover:bg-[#025eaa]" />
                      <h3 className="font-outfit text-sm font-black uppercase tracking-widest text-gray-900 transition-colors group-hover:text-[#025eaa]">
                        {item.category}
                      </h3>
                      <p className="mt-4 font-inter text-base leading-relaxed text-gray-600">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: Fixed (flex-none) */}
              <div className="flex flex-none items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-12 sm:py-8">
                <div className="hidden sm:block">
                  <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    LSP Protocol Specification
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full rounded-md bg-slate-900 px-10 py-4 font-outfit text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black active:scale-95 sm:w-auto"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
