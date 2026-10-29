"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import DateField from "@/components/DateField";
import { addDays, nightsBetween, pluralize } from "@/lib/dates";
import { MAX_ADULTS, MAX_CHILDREN, type FieldErrors } from "@/lib/validation";

export type FormState = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  childAges: string[]; // always MAX_CHILDREN long; only the first N are shown
};

type Props = {
  form: FormState;
  errors: FieldErrors;
  today: string;
  loading: boolean;
  onChange: (form: FormState) => void;
  onSubmit: () => void;
};

const inputClass =
  "h-9 w-full rounded-lg border bg-white px-3 text-sm leading-5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30";
const labelClass = "text-sm font-semibold leading-5 text-gray-700";
const errorClass = "text-xs font-medium leading-4 text-red-500";
const border = (invalid: boolean) => (invalid ? "border-red-500" : "border-gray-300");

export function childCount(value: string): number {
  return /^\d+$/.test(value.trim()) && Number(value) <= MAX_CHILDREN ? Number(value) : 0;
}

export default function SearchForm({ form, errors, today, loading, onChange, onSubmit }: Props) {
  const set = (patch: Partial<FormState>) => onChange({ ...form, ...patch });
  const nights = nightsBetween(form.checkIn, form.checkOut);
  const kids = childCount(form.children);

  function setCheckIn(value: string) {
    // Keep check-out after check-in.
    set(value && value >= form.checkOut ? { checkIn: value, checkOut: addDays(value, 1) } : { checkIn: value });
  }

  function setAge(index: number, value: string) {
    set({ childAges: form.childAges.map((a, i) => (i === index ? value : a)) });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[10px]">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold leading-[34px] text-gray-900">Hotel Finder</h1>
        <p className="text-sm leading-5 text-gray-500">Find the 3 cheapest good hotels for your trip</p>
      </header>

      <div className="flex flex-col gap-1">
        <label htmlFor="destination" className={labelClass}>
          Destination
        </label>
        <input
          id="destination"
          type="text"
          value={form.destination}
          placeholder="e.g. Goa"
          onChange={(e) => set({ destination: e.target.value })}
          aria-invalid={!!errors.destination}
          className={`${inputClass} ${border(!!errors.destination)}`}
        />
        {errors.destination && <p className={errorClass}>{errors.destination}</p>}
      </div>

      <div className="flex gap-4">
        <DateField
          id="check-in"
          label="Check-in"
          value={form.checkIn}
          min={today}
          suffix={form.checkIn === today ? " (Today)" : ""}
          invalid={!!errors.dates}
          onChange={setCheckIn}
        />
        <DateField
          id="check-out"
          label="Check-out"
          value={form.checkOut}
          min={addDays(form.checkIn || today, 1)}
          invalid={!!errors.dates}
          onChange={(checkOut) => set({ checkOut })}
        />
      </div>
      {errors.dates && <p className={errorClass}>{errors.dates}</p>}
      {nights >= 1 && <p className="text-xs leading-4 text-gray-500">{pluralize(nights, "night")}</p>}

      <div className="flex gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label htmlFor="adults" className={labelClass}>
            Adults
          </label>
          <input
            id="adults"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_ADULTS}
            value={form.adults}
            onChange={(e) => set({ adults: e.target.value })}
            aria-invalid={!!errors.adults}
            className={`${inputClass} ${border(!!errors.adults)}`}
          />
          {errors.adults && <p className={errorClass}>{errors.adults}</p>}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label htmlFor="children" className={labelClass}>
            Children
          </label>
          <input
            id="children"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_CHILDREN}
            value={form.children}
            onChange={(e) => set({ children: e.target.value })}
            aria-invalid={!!errors.children}
            className={`${inputClass} ${border(!!errors.children)}`}
          />
          {errors.children && <p className={errorClass}>{errors.children}</p>}
        </div>
      </div>

      {Array.from({ length: kids }, (_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <label htmlFor={`child-age-${i}`} className={labelClass}>
            {`Child ${i + 1} age`}
          </label>
          <div className="relative">
            <select
              id={`child-age-${i}`}
              value={form.childAges[i]}
              onChange={(e) => setAge(i, e.target.value)}
              className={`${inputClass} appearance-none pr-10 ${border(!!errors.childAges && form.childAges[i] === "")} ${
                form.childAges[i] === "" ? "text-gray-400" : ""
              }`}
            >
              <option value="">Select age (0–17)</option>
              {Array.from({ length: 18 }, (_, age) => (
                <option key={age} value={String(age)} className="text-gray-900">
                  {age}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
          </div>
        </div>
      ))}
      {kids > 0 && (
        <>
          {errors.childAges && <p className={errorClass}>{errors.childAges}</p>}
          <p className="text-xs leading-4 text-gray-500">One age field appears for each child</p>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-[38px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold leading-5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
