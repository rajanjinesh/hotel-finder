import type { Hotel, RawHotel } from "./types";

export const MIN_RATING = 7.0;
export const MAX_RESULTS = 3;

// Backup for the property-type filter sent to HasData: never show hostels or dorm beds.
const DORM_NAME = /\b(hostels?|dorms?|dormitor(?:y|ies))\b/i;

// PRD rules: skip hotels with no price, link or rating, and hostels/dorms.
// Hide ratings below 7.0, add taxes & charges to the price when known,
// sort by that total (cheapest first, higher rating first on a tie), keep the top 3.
export function pickTopHotels(raw: RawHotel[]): Hotel[] {
  return raw
    .flatMap((h): Hotel[] => {
      if (h.totalPrice === null || h.totalPrice <= 0 || !h.url) return [];
      if (h.rating === null || h.rating < MIN_RATING) return [];
      if (DORM_NAME.test(h.name)) return [];

      const taxesIncluded = h.excludedCharges !== null && h.excludedCharges >= 0;
      return [
        {
          id: h.id,
          name: h.name,
          city: h.city,
          totalPrice: Math.round(h.totalPrice + (taxesIncluded ? h.excludedCharges! : 0)),
          taxesIncluded,
          currency: h.currency,
          rating: h.rating,
          url: h.url,
        },
      ];
    })
    .sort((a, b) => a.totalPrice - b.totalPrice || b.rating - a.rating)
    .slice(0, MAX_RESULTS);
}

// The distinct cities of the hotels we show, in order, for the "Showing hotels in ..." line.
export function citiesOf(hotels: Hotel[]): string[] {
  const seen = new Set<string>();
  const cities: string[] = [];
  for (const { city } of hotels) {
    const key = city.toLowerCase();
    if (city && !seen.has(key)) {
      seen.add(key);
      cities.push(city);
    }
  }
  return cities;
}
