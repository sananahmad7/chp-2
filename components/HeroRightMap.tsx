"use client";

import HeroRightMapClient from "./HeroRightMapClient";

type Country = "DK" | "SE" | "NO" | "FI" | "IS";

type Props = {
    initialCountry?: Country;
    variant?: "frame" | "performativ";
    className?: string;
    accentRgb?: string;

    // kept for compatibility; ignored by the new client component
    initialStats?: unknown;
};

export default function HeroRightMap(props: Props) {
    return <HeroRightMapClient {...props} />;
}
