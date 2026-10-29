import { addDays, nightsBetween, parseDate, todayString } from "./dates";
import type { RawSearch, SearchInput } from "./types";

export const MAX_ADULTS = 10;
export const MAX_CHILDREN = 10;

export type FieldErrors = Partial<Record<"destination" | "dates" | "adults" | "children" | "childAges", string>>;

function toInt(v: string | number): number | null {
  if (typeof v === "number") return Number.isInteger(v) ? v : null;
  return /^\d+$/.test(v.trim()) ? Number(v.trim()) : null;
}

// `today` is a YYYY-MM-DD string; a check-in earlier than that is rejected.
export function validateSearch(input: RawSearch, today: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.destination.trim()) errors.destination = "Please enter a destination";

  if (!parseDate(input.checkIn) || !parseDate(input.checkOut)) {
    errors.dates = "Please pick a check-in and check-out date";
  } else if (input.checkIn < today) {
    errors.dates = "Check-in can't be in the past";
  } else if (nightsBetween(input.checkIn, input.checkOut) < 1) {
    errors.dates = "Check-out must be after check-in";
  }

  const adults = toInt(input.adults);
  if (adults === null || adults < 1 || adults > MAX_ADULTS) {
    errors.adults = `Enter 1 to ${MAX_ADULTS} adults`;
  }

  const children = toInt(input.children);
  if (children === null || children > MAX_CHILDREN) {
    errors.children = `Enter 0 to ${MAX_CHILDREN} children`;
  } else {
    const ages = input.childAges.slice(0, children).map((a) => (a === "" ? null : toInt(a)));
    if (ages.length < children || ages.some((a) => a === null || a > 17)) {
      errors.childAges = "Select an age (0–17) for each child";
    }
  }

  return errors;
}

// Only call after validateSearch returned no errors.
export function toSearchInput(input: RawSearch): SearchInput {
  const children = Number(input.children);
  return {
    destination: input.destination.trim(),
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: Number(input.adults),
    children,
    childAges: input.childAges.slice(0, children).map(Number),
  };
}

// The server may be in a different time zone than the traveler, so allow one day of slack.
export function serverToday(): string {
  return addDays(todayString(), -1);
}
