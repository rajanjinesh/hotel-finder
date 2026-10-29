export type RawSearch = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string | number;
  children: string | number;
  childAges: (string | number)[];
};

export type SearchInput = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childAges: number[];
};

// What the data source gives us. Price, rating and link can be missing.
export type RawHotel = {
  id: string;
  name: string;
  city: string; // "" when HasData doesn't say
  totalPrice: number | null;
  excludedCharges: number | null; // taxes and charges not in totalPrice, if HasData says
  currency: string;
  rating: number | null;
  url: string | null;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  totalPrice: number; // includes taxes & charges when taxesIncluded is true
  taxesIncluded: boolean;
  currency: string;
  rating: number;
  url: string;
};

export type HotelsResponse = { hotels: Hotel[] };
