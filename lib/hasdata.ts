import type { RawHotel, SearchInput } from "./types";

const ENDPOINT = "https://api.hasdata.com/scrape/booking/search";

const PROPERTY_TYPES = [
  "hotels",
  "resorts",
  "guesthouses",
  "bedAndBreakfast",
  "apartments",
  "entireHomesAndApartments",
  "homestays",
];

type HasDataResult = {
  hotelId?: number;
  title?: string;
  url?: string;
  location?: { city?: string; locationTitle?: string; address?: string };
  price?: { pricePerStayParsed?: number; excludedChargesParsed?: number; currency?: string };
  reviews?: { score?: number };
};

// Server only. Throws if the key is missing or HasData fails.
export async function searchHotels(search: SearchInput): Promise<RawHotel[]> {
  const apiKey = process.env.HASDATA_API_KEY;
  if (!apiKey) throw new Error("HASDATA_API_KEY is not set");

  const params = new URLSearchParams({
    keyword: search.destination,
    checkInDate: search.checkIn,
    checkOutDate: search.checkOut,
    rooms: "1",
    adults: String(search.adults),
    children: String(search.children),
    currency: "inr",
    sort: "priceLowestFirst",
  });
  if (search.children > 0) params.set("childrenAges", search.childAges.join(","));
  // Everything except hostels (families shouldn't see dorm beds).
  for (const type of PROPERTY_TYPES) params.append("propertyType[]", type);

  const res = await fetch(`${ENDPOINT}?${params}`, {
    headers: { "x-api-key": apiKey },
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HasData responded with status ${res.status}`);

  const data = (await res.json()) as { results?: HasDataResult[] };
  return (data.results ?? []).map(toRawHotel);
}

export function toRawHotel(r: HasDataResult): RawHotel {
  const price = r.price?.pricePerStayParsed;
  const charges = r.price?.excludedChargesParsed;
  const score = r.reviews?.score;
  return {
    id: String(r.hotelId ?? r.url ?? r.title),
    name: r.title ?? "",
    city: (r.location?.city ?? r.location?.locationTitle ?? "").trim(),
    totalPrice: typeof price === "number" ? price : null,
    excludedCharges: typeof charges === "number" ? charges : null,
    currency: r.price?.currency ?? "INR",
    rating: typeof score === "number" ? score : null,
    // Only ever link to Booking.com.
    url: r.url?.startsWith("https://www.booking.com/") ? r.url : null,
  };
}
