// components/layout/footer.tsx
import Image from "next/image";

const COMPANY = {
  name: "CPH Analytics ApS",
  reg: "DK 45351033",
  street: "Pladehals Allé 7",
  city: "2450 Copenhagen",
  email: "info@cphanalytics.com",
};

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/10 bg-[rgb(var(--header-bg-rgb)/0.98)] text-[var(--header-text-color)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo.svg"
                alt=""
                width={44}
                height={44}
                className="h-9 w-auto"
                priority={false}
              />
            </div>
          </div>

          {/* Contact (from image) */}
          <div className="md:col-span-5">
            <address className="text-sm not-italic leading-6 text-white/80">
              <div className="font-medium text-white/90">{COMPANY.name}</div>
              <div>{COMPANY.reg}</div>
              <div>{COMPANY.street}</div>
              <div>{COMPANY.city}</div>
              <a
                href={`mailto:${COMPANY.email}`}
                className="focus-visible:ring-[var(--accent-color)]/50 mt-2 inline-block text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70 focus-visible:outline-none focus-visible:ring-2"
              >
                {COMPANY.email}
              </a>
            </address>
          </div>

          {/* Social */}
          <div className="md:col-span-2 md:text-right">
            <a
              href="#"
              aria-label="LinkedIn"
              className="focus-visible:ring-[var(--accent-color)]/50 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
            >
              {/* Simple LinkedIn-style mark */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <path
                  d="M8 11v7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="8" r="1" fill="currentColor" />
                <path
                  d="M12 18v-4.2c0-1.3.8-2.1 2-2.1s2 .8 2 2.1V18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>

            <div className="mt-3 text-xs text-white/60">
              © {new Date().getFullYear()} CPH Analytics
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
