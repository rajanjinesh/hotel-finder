"use client";

import { ArrowLeft } from "lucide-react";
import { formatRange, nightsBetween, pluralize } from "@/lib/dates";
import { citiesOf } from "@/lib/hotels";
import type { Hotel, SearchInput } from "@/lib/types";

type Props = {
  search: SearchInput;
  hotels: Hotel[] | null; // null = the data source failed
  onNewSearch: () => void;
};

function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

// ["Calangute"] -> "Calangute", ["A", "B", "C"] -> "A, B and C"
function joinList(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function title(count: number): string {
  if (count === 3) return "Top 3 cheapest hotels";
  if (count === 1) return "Cheapest hotel found";
  return `${count} cheapest hotels found`;
}

function summary(s: SearchInput): string {
  const guests = [pluralize(s.adults, "adult"), s.children > 0 ? pluralize(s.children, "child").replace("childs", "children") : ""];
  return [
    s.destination,
    formatRange(s.checkIn, s.checkOut),
    pluralize(nightsBetween(s.checkIn, s.checkOut), "night"),
    guests.filter(Boolean).join(", "),
  ].join(" · ");
}

export default function Results({ search, hotels, onNewSearch }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-bold leading-[34px] text-gray-900">
            {hotels && hotels.length > 0 ? title(hotels.length) : "Hotel Finder"}
          </h1>
          <p className="text-sm leading-5 text-gray-500">{summary(search)}</p>
        </div>
        <button
          type="button"
          onClick={onNewSearch}
          className="flex w-fit items-center gap-1 text-sm font-medium leading-5 text-blue-600 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          New search
        </button>
      </header>

      {hotels === null && (
        <p role="alert" className="text-sm leading-5 text-gray-700">
          Something went wrong. Please try again.
        </p>
      )}

      {hotels?.length === 0 && (
        <p className="text-sm leading-5 text-gray-700">
          No hotels found. Try different dates or a different destination.
        </p>
      )}

      {hotels && hotels.length > 0 && citiesOf(hotels).length > 0 && (
        <p className="text-sm leading-5 text-gray-500">Showing hotels in {joinList(citiesOf(hotels))}</p>
      )}

      {hotels && hotels.length > 0 && (
        <ul className="flex flex-col gap-3">
          {hotels.map((hotel) => (
            <li key={hotel.id} className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 text-base font-bold leading-[22px] text-gray-900">{hotel.name}</h2>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold leading-[22px] text-gray-900">
                    {formatPrice(hotel.totalPrice, hotel.currency)}
                  </p>
                  <p className="text-xs leading-4 text-gray-500">
                    {hotel.taxesIncluded ? "total incl. taxes & charges" : "total for stay + taxes & charges"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm leading-5 text-gray-500">
                  <span className="font-semibold text-gray-900">{hotel.rating.toFixed(1)}</span> / 10 rating
                </p>
                <a
                  href={hotel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold leading-5 text-white hover:bg-blue-700"
                >
                  View on Booking.com
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
