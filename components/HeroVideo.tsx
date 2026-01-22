// components/HeroVideo.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Source = { src: string; type: string };
type Props = {
    poster: string;
    sources: Source[];
    objectPosition?: string;
    disableOnMobile?: boolean;
    className?: string;
    /** Start a tiny bit into the clip to avoid static first frames (in seconds). */
    startAt?: number;
    /** Fade length for the overlay (ms). Use 0 for hard cut. */
    revealMs?: number;
};

export default function HeroVideo({
                                      poster,
                                      sources,
                                      objectPosition = "center",
                                      disableOnMobile,
                                      className,
                                      startAt = 0.08,           // <-- skip ~80ms; set to 0 if you want the true first frame
                                      revealMs = 160,           // short, snappy fade
                                  }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [revealed, setRevealed] = useState(false);

    const isMobile =
        typeof window !== "undefined" &&
        /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

    useEffect(() => {
        if (disableOnMobile && isMobile) return;
        const v = videoRef.current;
        if (!v) return;

        // Kick the pipeline and ensure playback attempts to start.
        try { v.load(); } catch {}
        const startPlayback = () => v.play().catch(() => {});

        const reveal = () => {
            // double rAF ensures the painted frame is composited
            requestAnimationFrame(() => requestAnimationFrame(() => setRevealed(true)));
        };

        const onLoadedData = () => {
            // Optional: nudge past very static first frames
            if (startAt > 0 && Number.isFinite(v.duration) && v.duration > startAt + 0.1) {
                try { v.currentTime = startAt; } catch {} // some engines throw if seek is too early
            }

            startPlayback();

            const anyV = v as any;
            if (typeof anyV.requestVideoFrameCallback === "function") {
                let seen = 0;
                const cb = (_t: number, meta?: { mediaTime?: number }) => {
                    seen++;
                    if ((meta?.mediaTime ?? 0) > 0.03 || seen >= 2) reveal();
                    else anyV.requestVideoFrameCallback(cb);
                };
                anyV.requestVideoFrameCallback(cb);
            } else {
                const onTime = () => {
                    if (v.currentTime > 0.03) {
                        v.removeEventListener("timeupdate", onTime);
                        reveal();
                    }
                };
                v.addEventListener("timeupdate", onTime);
            }
        };

        v.addEventListener("loadeddata", onLoadedData, { once: true });
        return () => v.removeEventListener("loadeddata", onLoadedData);
    }, [disableOnMobile, isMobile, startAt]);

    return (
        <div aria-hidden className={clsx("absolute inset-0 -z-[10] overflow-hidden", className)}>
            {/* Keep video fully opaque; all blending happens on the overlay */}
            <video
                ref={videoRef}
                className="h-full w-full object-cover"
                style={{ objectPosition }}
                autoPlay
                muted
                loop
                playsInline

                webkit-playsinline="true"
                preload="auto"
                poster={poster}
            >
                {sources.map((s) => (
                    <source key={s.src} src={s.src} type={s.type} />
                ))}
            </video>

            {/* Poster overlay: gently animated until reveal, then quick fade/cut */}
            <img
                src={poster}
                alt=""
                className={clsx(
                    "pointer-events-none absolute inset-0 h-full w-full object-cover will-change-opacity will-change-transform",
                    !revealed && "hero-poster-alive",
                    revealMs > 0 ? "transition-opacity" : "",
                    revealMs > 0 ? `duration-[${revealMs}ms] ease-out` : "",
                    revealed ? "opacity-0" : "opacity-100"
                )}
                style={{ objectPosition }}
                loading="eager"
                decoding="async"
            />
        </div>
    );
}
