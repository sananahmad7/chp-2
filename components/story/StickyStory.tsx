// components/story/StickyStory.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type Scene = {
    id: string;
    kicker: string;
    title: string;
    body: string;
    media?: { src: string; alt: string };
};

type Props = { scenes: Scene[] };

export default function StickyStory({ scenes }: Props) {
    const prefersReduced = useReducedMotion();
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
            { rootMargin: "0px 0px -60% 0px", threshold: 0.15 }
        );
        refs.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    const fadeUp = useMemo(
        () => ({
            initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.45, ease: "easeOut" as const },
            viewport: { once: true, margin: "-10% 0px -10% 0px" },
        }),
        [prefersReduced]
    );

    return (
        <div className="relative bg-transparent">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Pinned progress */}
                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="text-sm text-gray-500">Story</div>
                            <ol className="space-y-3 text-sm">
                                {scenes.map((s, i) => (
                                    <li key={s.id} className="flex items-baseline gap-2">
                    <span
                        className={[
                            "inline-block h-1.5 w-1.5 rounded-full",
                            i === active ? "bg-emerald-500" : "bg-gray-300",
                        ].join(" ")}
                    />
                                        <span className={i === active ? "text-emerald-700" : "text-gray-500"}>
                      {s.kicker}
                    </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>

                    {/* Scrolling scenes */}
                    <div className="lg:col-span-8 space-y-28">
                        {scenes.map((s, i) => (
                            <section
                                key={s.id}
                                aria-labelledby={`${s.id}-title`}
                                data-index={i}
                                ref={(el) => (refs.current[i] = el)}
                                className="scroll-mt-24"
                            >
                                <motion.h3
                                    id={`${s.id}-title`}
                                    className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl"
                                    {...fadeUp}
                                >
                                    {s.title}
                                </motion.h3>

                                <motion.p
                                    className="mt-4 max-w-2xl text-lg text-gray-600"
                                    {...fadeUp}
                                    transition={{ ...fadeUp.transition, delay: 0.05 }}
                                >
                                    {s.body}
                                </motion.p>

                                {s.media ? (
                                    <motion.figure
                                        className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white"
                                        {...fadeUp}
                                        transition={{ ...fadeUp.transition, delay: 0.1 }}
                                    >
                                        <div className="relative aspect-[16/10]">
                                            <Image
                                                src={s.media.src}
                                                alt={s.media.alt}
                                                fill
                                                sizes="(min-width: 1024px) 50vw, 100vw"
                                                className="object-cover"
                                                priority={i === 0}
                                            />
                                        </div>
                                    </motion.figure>
                                ) : null}
                            </section>
                        ))}

                        {/* CTA at the end */}
                        <motion.div className="pt-6 border-t border-gray-200/80" {...fadeUp}>
                            <a
                                href="/contact"
                                className="inline-flex items-center rounded-md bg-emerald-500 px-5 py-3 font-medium text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                                Book a consultation
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
