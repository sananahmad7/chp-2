// app/head.tsx
export default function Head() {
    return (
        <>
            {/* Preload the *first* <source> the browser will select */}
            <link rel="preload" as="video" href="/video/lsp-hero.webm" type="video/webm" />
            {/* Optional: lightweight UA-gated MP4 preload for Safari (avoids waste on Chrome) */}
            {/* If you don't have UA gating, you can skip this second preload */}
            <link rel="preload" as="image" href="/video/lsp-poster.jpg" fetchPriority="high" />
            {/* If you host assets on a CDN:
      <link rel="preconnect" href="https://cdn.example.com" crossOrigin="" /> */}
        </>
    );
}
