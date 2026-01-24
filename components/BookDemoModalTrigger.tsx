"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

type Props = {
    label?: string;
    className?: string;
    bookingUrl?: string;      // e.g. Calendly / HubSpot meeting link
    embedCalendly?: boolean;  // if true, uses Calendly inline widget script
};

export default function BookDemoModalTrigger({
                                                 label = "Book a demo",
                                                 className = "",
                                                 bookingUrl = "",
                                                 embedCalendly = true,
                                             }: Props) {
    const [open, setOpen] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!open) return;

        // lock background scroll
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // close on ESC
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);

        // focus close button for accessibility
        queueMicrotask(() => closeBtnRef.current?.focus());

        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={className}>
                {label}
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                        aria-hidden
                    />

                    {/* Modal */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="book-demo-title"
                        className="relative w-full max-w-4xl rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="book-demo-title"
                                    className="text-lg font-semibold text-[var(--text-color)]"
                                >
                                    Book a demonstration
                                </h2>
                                <p className="mt-1 text-sm text-[var(--muted-text)]">
                                    Pick a time that works—pricing, tenders, shortages, and traceability walkthrough.
                                </p>
                            </div>

                            <button
                                ref={closeBtnRef}
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md px-2 py-1 text-[var(--muted-text)] hover:text-[var(--text-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-12">
                            {/* Left column: summary + fallbacks */}
                            <div className="lg:col-span-4">
                                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
                                    <div className="text-sm font-medium text-[var(--text-color)]">
                                        What you’ll see
                                    </div>
                                    <ul className="mt-2 space-y-2 text-sm text-[var(--muted-text)]">
                                        <li>• Coverage & data sources by country/chain</li>
                                        <li>• Price/tender signals with audit trail</li>
                                        <li>• Shortage risk with explainable drivers</li>
                                    </ul>

                                    <div className="mt-4 flex flex-col gap-2">
                                        {bookingUrl ? (
                                            <a
                                                href={bookingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center rounded-md bg-[var(--primary-color)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                            >
                                                Open booking page
                                            </a>
                                        ) : null}

                                        <Link
                                            href="/contact?topic=life-sciences"
                                            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-[var(--text-color)] ring-1 ring-[var(--border-color)] transition hover:ring-[var(--gray-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                        >
                                            Prefer email? Use contact form
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right column: scheduler embed (Calendly or iframe) */}
                            <div className="lg:col-span-8">
                                {bookingUrl ? (
                                    embedCalendly ? (
                                        <>
                                            <div
                                                className="calendly-inline-widget overflow-hidden rounded-xl border border-[var(--border-color)]"
                                                data-url={bookingUrl}
                                                style={{ height: 640, width: "100%" }}
                                            />
                                            <Script
                                                src="https://assets.calendly.com/assets/external/widget.js"
                                                strategy="lazyOnload"
                                            />
                                        </>
                                    ) : (
                                        <div className="overflow-hidden rounded-xl border border-[var(--border-color)]">
                                            <iframe
                                                title="Book a demo"
                                                src={bookingUrl}
                                                className="h-[640px] w-full"
                                                allow="fullscreen; clipboard-write"
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="rounded-xl border border-[var(--border-color)] p-4 text-sm text-[var(--muted-text)]">
                                        Add a booking URL (Calendly/HubSpot/etc.) to embed the scheduler here.
                                        <div className="mt-2">
                                            Example: set a Calendly link and pass it as <code>bookingUrl</code>.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
