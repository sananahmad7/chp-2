"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBookingModal } from "@/components/shared/booking-modal-provider";

export type Scene = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  media?: { src: string; alt: string };
};

type Props = { scenes: Scene[] };

export default function StickyStory({ scenes }: Props) {
  const { open: openBookingModal } = useBookingModal();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) setActive(idx);
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.15 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const fadeUp = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      viewport: { once: true, margin: "-10% 0px" },
    }),
    [],
  );

  return (
    <div className="relative bg-white font-inter">
      <div className="container mx-auto px-4 py-24 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* LEFT AREA: Pinned Progress Timeline */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#025eaa]">
                Platform Journey
              </div>

              <h3 className="mb-12 font-outfit text-3xl font-bold text-gray-900">
                Life Science <br /> Pro Story
              </h3>

              <div className="relative">
                {/* Vertical Timeline Track */}
                <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-gray-100" />

                <ol className="relative space-y-10">
                  {scenes.map((s, i) => (
                    <li
                      key={s.id}
                      className="group relative flex items-start gap-6"
                    >
                      {/* Animated Indicator */}
                      <div className="relative z-10 flex h-4 items-center">
                        <div
                          className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 ${
                            i === active
                              ? "scale-125 border-[#025eaa] bg-white ring-4 ring-blue-50"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        />
                      </div>

                      <button
                        onClick={() =>
                          refs.current[i]?.scrollIntoView({
                            behavior: "smooth",
                          })
                        }
                        className={`text-left font-outfit text-sm transition-all duration-300 ${
                          i === active
                            ? "translate-x-1 font-bold text-[#025eaa]"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {s.kicker}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>

          {/* RIGHT AREA: Scrolling Content */}
          <div className="space-y-40 lg:col-span-8">
            {scenes.map((s, i) => (
              <section
                key={s.id}
                data-index={i}
                ref={(el) => (refs.current[i] = el)}
                className="scroll-mt-32"
              >
                <div className="max-w-3xl">
                  <motion.h3
                    className="font-outfit text-3xl font-bold leading-tight text-gray-900 md:text-5xl"
                    {...fadeUp}
                  >
                    {s.title}
                  </motion.h3>

                  <motion.p
                    className="mt-8 text-lg leading-relaxed text-gray-600"
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.1 }}
                  >
                    {s.body}
                  </motion.p>
                </div>

                {s.media && (
                  <motion.div
                    className="group relative mt-12"
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.2 }}
                  >
                    {/* Shadow Decorator */}
                    <div className="absolute -inset-4 rounded-[2rem] bg-gray-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <figure className="relative overflow-hidden rounded-md border border-gray-100 bg-white shadow-2xl">
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={s.media.src}
                          alt={s.media.alt}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          priority={i === 0}
                        />
                      </div>

                      {/* Optional: Source indicator like the previous sections */}
                      <div className="flex items-center justify-between border-t border-gray-50 bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span>Platform Insight 0{i + 1}</span>
                        <span>Source: CPH Analytics</span>
                      </div>
                    </figure>
                  </motion.div>
                )}
              </section>
            ))}

            {/* Final Conversion Section */}
            <motion.div
              className="rounded-md border border-gray-100 bg-gray-50 p-12 text-center"
              {...fadeUp}
            >
              <h4 className="mb-6 font-outfit text-2xl font-bold text-gray-900">
                Ready to see your specific market data?
              </h4>
              <button
                type="button"
                onClick={() => openBookingModal("Book a consultation")}
                className="inline-flex items-center rounded-md bg-[#025eaa] px-10 py-5 font-outfit font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#014a87] active:scale-95"
              >
                Book a consultation
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
