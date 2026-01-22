import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const country = (url.searchParams.get("country") ?? "DK").toUpperCase();

    // TODO: replace with real DB lookups. For now, simple demo numbers per country:
    const demo = {
        DK: { changes: [79, 20, 59], avail: [40, 33, 0], status: [0, 2, 7], label: "current A‑price period" },
        SE: { changes: [64, 28, 36], avail: [22, 17, 0], status: [3, 1, 2], label: "rolling 14d" },
        NO: { changes: [42, 19, 23], avail: [15, 11, 0], status: [2, 0, 3], label: "rolling 14d" },
        FI: { changes: [31, 12, 19], avail: [9, 8, 0],   status: [1, 1, 2], label: "rolling 14d" },
        IS: { changes: [12, 5, 7],  avail: [4, 3, 0],   status: [0, 0, 1], label: "rolling 14d" },
    } as const;

    const d = demo[(country as keyof typeof demo) || "DK"];

    const payload = {
        asOf: new Date().toISOString(),
        country,
        windowLabel: d.label,
        priceChanges: { totalChanged: d.changes[0], increases: d.changes[1], decreases: d.changes[2] },
        availability: { shortage: d.avail[0], atRisk: d.avail[1], total: d.avail[0] + d.avail[1] + d.avail[2] },
        status: { new: d.status[0], back: d.status[1], discontinued: d.status[2] },
    };

    const res = NextResponse.json(payload);
    // Cache at the edge for 15 minutes, then serve stale while revalidating
    res.headers.set("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
    return res;
}
