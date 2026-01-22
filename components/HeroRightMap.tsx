// components/HeroRightMap.tsx
import fs from "fs/promises";
import path from "path";
import HeroRightMapClient from "./HeroRightMapClient";

type Props = {
    initialCountry?: "DK" | "SE" | "NO" | "FI" | "IS";
    initialStats?: {
        asOf: string;
        country: string;
        windowLabel: string;
        priceChanges: { totalChanged: number; increases: number; decreases: number };
        availability: { shortage: number; atRisk: number; total: number };
        status: { new: number; back: number; discontinued: number };
    };
    variant?: "frame" | "performativ";
    className?: string;
};

export default async function HeroRightMap(props: Props) {
    let svgMarkup: string | undefined;
    try {
        const file = path.join(process.cwd(), "public", "maps", "nordics.svg");
        svgMarkup = await fs.readFile(file, "utf8");
    } catch {
        svgMarkup = undefined;
    }

    return <HeroRightMapClient {...props} svgMarkup={svgMarkup} />;
}
