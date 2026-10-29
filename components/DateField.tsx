"use client";

import { CalendarDays } from "lucide-react";
import { useRef } from "react";
import { formatDate } from "@/lib/dates";

type Props = {
  id: string;
  label: string;
  value: string;
  min: string;
  suffix?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
};

// Shows the date as "29 Oct 2026" and uses the browser's own date picker underneath.
export default function DateField({ id, label, value, min, suffix = "", invalid, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    try {
      inputRef.current?.showPicker();
    } catch {
      // Some browsers only open the picker from the native icon; that still works.
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold leading-5 text-gray-700">
        {label}
      </label>
      <div
        className={`relative flex h-9 items-center justify-between rounded-lg border bg-white px-3 focus-within:ring-2 focus-within:ring-blue-600/30 ${
          invalid ? "border-red-500" : "border-gray-300"
        }`}
      >
        <span className="text-sm leading-5 text-gray-900">
          {value ? `${formatDate(value)}${suffix}` : <span className="text-gray-400">Select date</span>}
        </span>
        <CalendarDays className="size-5 text-gray-500" aria-hidden />
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          onClick={openPicker}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}
