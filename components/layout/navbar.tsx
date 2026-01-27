"use client";

import { useBookingModal } from "@/components/shared/booking-modal-provider";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import useScroll from "@/lib/hooks/use-scroll";

const NAV = [
  { name: "Pillars", href: "#pillars" },
  { name: "LSP Story", href: "#lsp-story" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
] as const;

const CLIENT_LOGIN_URL = "https://lsp.cphanalytics.com/";

export default function NavBar() {
  const scrolled = useScroll(16);
  const { open } = useBookingModal();

  useEffect(() => {
    const root = document.documentElement;
    if (scrolled) {
      root.setAttribute("data-scrim", "1");
      root.removeAttribute("data-overlay-header");
    } else {
      root.removeAttribute("data-scrim");
      root.setAttribute("data-overlay-header", "1");
    }
  }, [scrolled]);

  const scrollToHash = (href: string) => {
    if (!href.startsWith("#")) return;
    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  };

  const headerBase =
    "fixed inset-x-0 top-0 z-50 transition-[background-color,opacity,box-shadow,border-color] duration-300 will-change-transform";
  const atTop =
    "!bg-transparent !backdrop-blur-0 !shadow-none !border-transparent text-[var(--header-text-color)]";
  const afterScroll =
    "bg-[rgb(var(--header-bg-rgb)/0.98)] text-[var(--header-text-color)] backdrop-blur border-b border-white/10 shadow-sm";

  const linkBase =
    "relative inline-flex items-center rounded-md px-2 py-2 text-[15px] font-semibold leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-transparent after:rounded-full after:transition-transform after:content-['']";
  const linkHover =
    "hover:text-[var(--blue-100)] hover:after:scale-x-100 hover:after:bg-[var(--accent-color)]";

  const topTextShadow = scrolled
    ? ""
    : "drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]";

  const cta =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-[var(--accent-color)] hover:opacity-90 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/40";
  const ghost =
    "inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-[var(--header-text-color)] ring-1 ring-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/40";

  return (
    <header className={`${headerBase} ${scrolled ? afterScroll : atTop}`}>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        {/* Brand */}
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="CPH Analytics home"
            className={`flex items-center rounded px-1 ${topTextShadow}`}
          >
            <Image
              src="/brand/logo.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="h-8 w-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash(item.href);
                  }}
                  className={[linkBase, linkHover, topTextShadow].join(" ")}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href={CLIENT_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={[ghost, topTextShadow, "hidden lg:inline-flex"].join(
              " ",
            )}
          >
            Client Login
          </a>

          <button
            type="button"
            onClick={() => open("Book a consultation")}
            className={[cta, topTextShadow, "hidden lg:inline-flex"].join(" ")}
          >
            Book a consultation
          </button>

          {/* Mobile menu */}
          <details className="relative lg:hidden">
            <summary
              aria-label="Open menu"
              className={[
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded",
                scrolled
                  ? "border border-white/15 bg-white/5"
                  : "border border-transparent bg-transparent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]",
                "[&::-webkit-details-marker]:hidden",
                topTextShadow,
              ].join(" ")}
            >
              {/* icon... */}
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
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </summary>

            <div className="absolute right-0 mt-2 w-64 rounded-md border border-white/10 bg-[rgb(var(--header-bg-rgb)/0.98)] p-3 text-[var(--header-text-color)] shadow-lg backdrop-blur">
              <nav aria-label="Primary (mobile)">
                <ul className="flex flex-col gap-1.5 text-sm">
                  {NAV.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        scroll={false}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHash(item.href);
                          (
                            e.currentTarget.closest(
                              "details",
                            ) as HTMLDetailsElement | null
                          )?.removeAttribute("open");
                        }}
                        className="block rounded px-3 py-2 hover:bg-white/5 hover:text-[var(--blue-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}

                  <li className="mt-1">
                    <a
                      href={CLIENT_LOGIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) =>
                        (
                          e.currentTarget.closest(
                            "details",
                          ) as HTMLDetailsElement | null
                        )?.removeAttribute("open")
                      }
                      className="block rounded px-3 py-2 hover:bg-white/5 hover:text-[var(--blue-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                    >
                      Client Login
                    </a>
                  </li>

                  <li className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        (
                          e.currentTarget.closest(
                            "details",
                          ) as HTMLDetailsElement | null
                        )?.removeAttribute("open");
                        open("Book a consultation");
                      }}
                      className="focus-visible:ring-[var(--accent-color)]/40 block w-full rounded-md bg-[var(--accent-color)] px-3 py-2 text-center font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
                    >
                      Book a consultation
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
