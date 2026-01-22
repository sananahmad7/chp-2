// components/layout/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useScroll from "@/lib/hooks/use-scroll";

const NAV = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Solutions", href: "/solutions" },
    { name: "Contact", href: "/contact" },
] as const;

export default function NavBar() {
    const scrolled = useScroll(16);
    const pathname = usePathname();

    // Turn scrim ON only after scroll, and remove page offset when at top.
    useEffect(() => {
        const root = document.documentElement;
        if (scrolled) {
            root.setAttribute("data-scrim", "1");            // enable scrim
            root.removeAttribute("data-overlay-header");      // restore any page offset rules
        } else {
            root.removeAttribute("data-scrim");               // disable scrim
            root.setAttribute("data-overlay-header", "1");    // remove page offset so hero sits under header
        }
    }, [scrolled]);

    const headerBase =
        "fixed inset-x-0 top-1 z-50 transition-[background-color,opacity,box-shadow,border-color] duration-300 will-change-transform";

    // Fully transparent at top; solid/blurred after scroll
    const atTop =
        "!bg-transparent !backdrop-blur-0 !shadow-none !border-transparent text-[var(--header-text-color)]";
    const afterScroll =
        "bg-[rgb(var(--header-bg-rgb)/0.98)] text-[var(--header-text-color)] backdrop-blur border-b border-white/10 shadow-sm";

    // Thin (1px) underline close to text; blue on hover/active
    const linkBase =
        "relative inline-flex items-center rounded-md px-2 py-2 text-[15px] font-semibold leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-transparent after:rounded-full after:transition-transform after:content-['']";
    const linkHover =
        "hover:text-[var(--blue-100)] hover:after:scale-x-100 hover:after:bg-[var(--accent-color)]";
    const linkActive = "after:scale-x-100 after:!bg-[var(--accent-color)]";

    // Subtle text shadow only when header is transparent (over bright hero)
    const topTextShadow = scrolled ? "" : "drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]";

    // Buttons
    const cta =
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-[var(--accent-color)] hover:opacity-90 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/40";
    const ghost =
        "inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-[var(--header-text-color)] ring-1 ring-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/40";

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname?.startsWith(href));

    return (
        <header className={`${headerBase} ${scrolled ? afterScroll : atTop}`}>
            <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-6">
                {/* Brand */}
                <div className="flex items-center">
                    <Link
                        href="/"
                        aria-label="CPH Analytics home"
                        className={`flex items-center rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] ${topTextShadow}`}
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

                {/* Primary nav */}
                <nav aria-label="Primary" className="hidden md:block">
                    <ul className="flex items-center gap-8">
                        {NAV.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={[
                                            linkBase,
                                            topTextShadow,
                                            active ? linkActive : linkHover,
                                        ].join(" ")}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* CTA + login */}
                <div className="flex items-center justify-end gap-3">
                    <Link
                        href="/client-login"
                        className={[ghost, topTextShadow, "hidden md:inline-flex"].join(" ")}
                    >
                        Client Login
                    </Link>

                    <Link href="/contact" className={`${cta} ${topTextShadow}`}>
                        Book a consultation
                    </Link>

                    {/* Mobile menu */}
                    <details className="relative md:hidden">
                        <summary
                            aria-label="Open menu"
                            className={[
                                "flex h-9 w-9 items-center justify-center rounded cursor-pointer",
                                scrolled
                                    ? "border border-white/15 bg-white/5"
                                    : "border border-transparent bg-transparent",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]",
                                "[&::-webkit-details-marker]:hidden",
                                topTextShadow,
                            ].join(" ")}
                        >
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
                                    {NAV.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    aria-current={active ? "page" : undefined}
                                                    className={[
                                                        "block rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]",
                                                        active
                                                            ? "bg-white/10"
                                                            : "hover:bg-white/5 hover:text-[var(--blue-100)]",
                                                    ].join(" ")}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    <li className="mt-1">
                                        <Link
                                            href="/client-login"
                                            className="block rounded px-3 py-2 hover:bg-white/5 hover:text-[var(--blue-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                                        >
                                            Client Login
                                        </Link>
                                    </li>
                                    <li className="pt-2">
                                        <Link
                                            href="/contact"
                                            className="block rounded-md bg-[var(--accent-color)] px-3 py-2 text-center font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/40"
                                        >
                                            Book a consultation
                                        </Link>
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
