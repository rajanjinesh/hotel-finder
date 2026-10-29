import { NextResponse } from "next/server";
import { searchHotels } from "@/lib/hasdata";
import { pickTopHotels } from "@/lib/hotels";
import type { HotelsResponse, RawSearch } from "@/lib/types";
import { serverToday, toSearchInput, validateSearch } from "@/lib/validation";

function parseBody(body: unknown): RawSearch | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === "number" || typeof v === "string" ? v : "");
  if (typeof b.destination !== "string" || typeof b.checkIn !== "string" || typeof b.checkOut !== "string") {
    return null;
  }
  return {
    destination: b.destination,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    adults: num(b.adults),
    children: num(b.children),
    childAges: Array.isArray(b.childAges) ? b.childAges.map(num) : [],
  };
}

export async function POST(request: Request) {
  const raw = parseBody(await request.json().catch(() => null));
  if (!raw || Object.keys(validateSearch(raw, serverToday())).length > 0) {
    return NextResponse.json({ error: "Invalid search" }, { status: 400 });
  }

  try {
    const hotels = pickTopHotels(await searchHotels(toSearchInput(raw)));
    return NextResponse.json<HotelsResponse>({ hotels });
  } catch (error) {
    // Log the reason only; never the request URL or headers (they hold the API key).
    console.error("Hotel search failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Data source failed" }, { status: 502 });
  }
}
