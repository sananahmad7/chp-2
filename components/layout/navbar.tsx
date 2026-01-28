"use client";

import { useState, useEffect } from "react";
import { useBookingModal } from "@/components/shared/booking-modal-provider";
import Link from "next/link";
import Image from "next/image";
// 1. Import Lucide Icons
import { Menu, X, ChevronRight, LogIn } from "lucide-react";
import useScroll from "@/lib/hooks/use-scroll";

const NAV_LINKS = [
  { name: "Pillars", href: "#pillars" },
  { name: "LSP Story", href: "#lsp-story" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
] as const;

const CLIENT_LOGIN_URL = "https://lsp.cphanalytics.com/";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(16);
  const { open: openBookingModal } = useBookingModal();

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
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b font-outfit transition-all duration-300 ${
        scrolled
          ? "h-16 border-white/10 bg-[rgb(var(--header-bg-rgb)/0.98)] shadow-lg backdrop-blur"
          : "h-20 border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto h-full px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full items-center justify-between">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="relative block">
              <Image
                src="/brand/logo.svg"
                alt="CPH Analytics Logo"
                width={160}
                height={40}
                className={`h-9 w-auto transition-transform duration-300 ${
                  !scrolled ? "scale-110" : "scale-100"
                }`}
                priority
              />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden items-center space-x-2 lg:flex xl:space-x-6">
            <div className="flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToHash(link.href)}
                  className="relative px-3 py-2 text-sm font-semibold text-[var(--header-text-color)] transition-colors duration-200 hover:text-[var(--accent-color)]"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <a
                href={CLIENT_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--header-text-color)] ring-1 ring-white/20 transition-all hover:bg-white/10"
              >
                <LogIn className="h-4 w-4 opacity-70 group-hover:text-[var(--accent-color)]" />
                Client Login
              </a>

              <button
                type="button"
                onClick={() => openBookingModal("Book a consultation")}
                className="group flex transform items-center gap-2 rounded-full bg-[var(--accent-color)] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
              >
                Book a consultation
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[var(--header-text-color)] transition-colors hover:text-[var(--accent-color)]"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 border-t border-white/10 bg-[rgb(var(--header-bg-rgb)/0.98)] backdrop-blur-xl lg:hidden">
          <div className="space-y-2 px-4 pb-8 pt-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToHash(link.href)}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-[var(--header-text-color)] hover:bg-white/5 hover:text-[var(--accent-color)]"
              >
                {link.name}
                <ChevronRight className="h-4 w-4 opacity-40" />
              </button>
            ))}

            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <a
                href={CLIENT_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-[var(--header-text-color)] ring-1 ring-white/20"
              >
                <LogIn className="h-4 w-4" />
                Client Login
              </a>

              <button
                onClick={() => {
                  setIsOpen(false);
                  openBookingModal("Book a consultation");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-color)] px-4 py-4 font-bold text-white"
              >
                Book a consultation
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
