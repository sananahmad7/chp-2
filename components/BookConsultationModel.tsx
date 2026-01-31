"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export default function BookConsultationModal({
  open,
  onClose,
  title = "Book a consultation",
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setName("");
    setEmail("");
    setDate("");
    setTime("");
    setMessage("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      lastActiveRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const modalPanel =
    "w-full max-w-lg rounded-md border border-slate-300 bg-white text-slate-900 shadow-2xl font-inter overflow-hidden flex flex-col max-h-[90vh]";
  const field =
    "mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#025eaa] focus:ring-1 focus:ring-[#025eaa] transition-all font-inter";
  const labelStyle =
    "text-[10px] font-bold uppercase tracking-widest text-slate-400 font-inter";
  const helper = "text-sm leading-relaxed text-slate-500 font-inter";
  const cta =
    "inline-flex items-center rounded-md bg-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-black active:scale-95 shadow-lg font-inter";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-inter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalPanel}>
          <div className="h-1.5 w-full shrink-0 bg-[#025eaa]" />

          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 p-6 sm:p-10">
            <div>
              <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] text-[#025eaa]">
                Technical Access
              </span>
              <h2
                id="booking-title"
                className="mt-2 font-outfit text-2xl font-bold tracking-tight text-slate-900"
              >
                {title}
              </h2>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable Form Content */}
          <form
            className="flex-1 overflow-y-auto px-6 pb-6 sm:px-10 sm:pb-10"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <p className={`mb-6 ${helper}`}>
              Provide your project details to coordinate a technical session
              with our specialists.
            </p>

            <div className="grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className={labelStyle}>Full Name</span>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Dr. Sarah Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                  />
                </label>

                <label className="block">
                  <span className={labelStyle}>Professional Email</span>
                  <input
                    type="email"
                    required
                    placeholder="sarah@lifescience.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className={labelStyle}>Proposed Date</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={field}
                  />
                </label>

                <label className="block">
                  <span className={labelStyle}>Time</span>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={field}
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelStyle}>Project Context</span>
                <textarea
                  rows={3}
                  placeholder="Describe your requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${field} resize-none`}
                />
              </label>
            </div>

            {submitted && (
              <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                Submission successful. Our team will reach out within 24 hours.
              </div>
            )}

            <div className="sticky bottom-0 mt-10 flex items-center justify-between gap-4 border-t border-slate-100 bg-white pt-8">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>

              <button type="submit" className={cta}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
