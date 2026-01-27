// components/layout/footer.tsx
import Image from "next/image";
import Link from "next/link";

const COMPANY = {
  name: "CPH Analytics ApS",
  reg: "CVR: DK 45351033",
  street: "Pladehals Allé 7",
  city: "2450 Copenhagen",
  email: "info@cphanalytics.com",
};

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/10 bg-[rgb(var(--header-bg-rgb)/0.98)] py-14 text-[var(--header-text-color)]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* 1. Left Section: Brand & Bio */}
          <div className="max-w-md lg:flex-1">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
            >
              <Image
                src="/brand/logo.svg"
                alt="CPH Analytics Logo"
                width={44}
                height={44}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-6 text-base leading-7 text-white/70">
              Clear signals for pricing, tenders, and supply risk. We build the
              tools that empower regulated life science teams to move from
              evidence to action with precision and trust.
            </p>
          </div>

          {/* 2. Right Section: Contact & Identity */}
          <div className="flex flex-col items-start gap-8 lg:items-end lg:text-right">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-color)]">
                Contact Information
              </h3>
              <address className="text-sm not-italic leading-relaxed text-white/60">
                <p className="font-semibold text-white/90">{COMPANY.name}</p>
                <p>{COMPANY.street}</p>
                <p>{COMPANY.city}</p>
                <p>{COMPANY.reg}</p>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="mt-2 inline-block text-[var(--accent-color)] transition-colors hover:text-white"
                >
                  {COMPANY.email}
                </a>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean & Minimal */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/40">
            <span>© {new Date().getFullYear()} CPH Analytics ApS</span>
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Use
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
            From signal to measured action
          </p>
        </div>
      </div>
    </footer>
  );
}
