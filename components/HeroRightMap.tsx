"use client";

import HeroRightMapClient from "./HeroRightMapClient";

type Country = "DK" | "SE" | "NO" | "FI" | "IS";

type Props = {
    initialCountry?: Country;
    className?: string;
    accentRgb?: string;
    svgMarkup?: string;

    // kept for compatibility; ignored by the new client component
    initialStats?: unknown;
    variant?: "frame" | "performativ";
};

export default function HeroRightMap(props: Props) {
    return <HeroRightMapClient {...props} />;
}
