"use client";

import { useState, useSyncExternalStore } from "react";
import Results from "@/components/Results";
import SearchForm, { type FormState } from "@/components/SearchForm";
import { addDays, todayString } from "@/lib/dates";
import type { Hotel, HotelsResponse, SearchInput } from "@/lib/types";
import { MAX_CHILDREN, toSearchInput, validateSearch } from "@/lib/validation";

type Outcome = { search: SearchInput; hotels: Hotel[] | null };

function initialForm(): FormState {
  const today = todayString();
  return {
    destination: "",
    checkIn: today,
    checkOut: addDays(today, 1),
    adults: "1",
    children: "0",
    childAges: Array(MAX_CHILDREN).fill(""),
  };
}

function App() {
  const [today] = useState(todayString);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const errors = submitted ? validateSearch(form, today) : {};

  async function search() {
    setSubmitted(true);
    if (Object.keys(validateSearch(form, today)).length > 0) return;

    const input = toSearchInput(form);
    setLoading(true);
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = (await res.json()) as HotelsResponse;
      setOutcome({ search: input, hotels: data.hotels });
    } catch {
      setOutcome({ search: input, hotels: null });
    } finally {
      setLoading(false);
    }
  }

  if (outcome) {
    return <Results search={outcome.search} hotels={outcome.hotels} onNewSearch={() => setOutcome(null)} />;
  }

  return <SearchForm form={form} errors={errors} today={today} loading={loading} onChange={setForm} onSubmit={search} />;
}

const subscribe = () => () => {};

// Dates depend on the visitor's clock, so render only in the browser.
export default function HotelFinder() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted ? <App /> : null;
}
