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
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Reset form each time it opens
  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setName("");
    setEmail("");
    setDate("");
    setTime("");
    setMessage("");
  }, [open]);

  // Accessibility + body scroll lock + ESC close + focus restore
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

  // Theme-aligned styles
  const modalPanel =
    "w-full max-w-lg rounded-2xl border border-white/10 bg-[rgb(var(--header-bg-rgb)/0.98)] text-[var(--header-text-color)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur";
  const field =
    "mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--header-text-color)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/50";
  const labelStyle = "text-xs font-semibold text-white/80";
  const helper = "text-sm text-white/70";
  const cta =
    "inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-[var(--accent-color)] hover:opacity-90 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/40";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // click-outside
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60" aria-hidden />

      {/* panel */}
      <div
        className="relative w-full max-w-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={modalPanel}>
          <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 id="booking-title" className="text-lg font-semibold">
                {title}
              </h2>
              <p className={`mt-1 ${helper}`}>
                Fill in your details below to schedule a session.
              </p>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="focus-visible:ring-[var(--accent-color)]/50 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
            >
              <span className="sr-only">Close</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form
            className="px-5 pb-5 sm:px-6 sm:pb-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              // Logic to send name, email, date, time, message would go here
            }}
          >
            <div className="grid gap-4">
              {/* Name and Email Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelStyle}>Full Name</span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                  />
                </label>

                <label className="block">
                  <span className={labelStyle}>Email Address</span>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                  />
                </label>
              </div>

              {/* Date and Time Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelStyle}>Preferred Date</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={field}
                  />
                </label>

                <label className="block">
                  <span className={labelStyle}>Preferred Time</span>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={field}
                  />
                </label>
              </div>

              {/* Message Field */}
              <label className="block">
                <span className={labelStyle}>
                  Briefly describe your project
                </span>
                <textarea
                  rows={3}
                  placeholder="Tell us a bit about what you're working on..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${field} resize-none`}
                />
              </label>
            </div>

            {submitted ? (
              <div
                role="status"
                className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200"
              >
                Thank you, {name.split(" ")[0]}! Your request was submitted.
                We'll email you at {email} soon.
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="focus-visible:ring-[var(--accent-color)]/40 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--header-text-color)] ring-1 ring-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
              >
                Cancel
              </button>

              <button type="submit" className={cta}>
                Submit request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
