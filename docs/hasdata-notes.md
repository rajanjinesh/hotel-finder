# HasData Booking.com: notes

From one test search (Goa, 2026-10-30 to 2026-10-31, 1 room, 2 adults, 1 child aged 5) and the HasData docs.

## Endpoint
- `GET https://api.hasdata.com/scrape/booking/search`
- Auth: header `x-api-key: <HASDATA_API_KEY>` (server only)

## Request parameters we use
| Param | Value | Notes |
|---|---|---|
| `keyword` | destination text | free text, e.g. `Goa` |
| `checkInDate`, `checkOutDate` | `YYYY-MM-DD` | |
| `rooms` | `1` | decision: 1 room |
| `adults` | number | |
| `children` | number, 0–10 | `0` if none |
| `childrenAges` | `5` or `1,3,7` | comma-separated, one per child, required if children > 0 |
| `currency` | `inr` | **lowercase only**: `INR` is rejected with a 422 |
| `sort` | `priceLowestFirst` | so page 1 holds the cheapest hotels, not Booking's "top picks" |

Page 1 has 25 results (decision: one page is enough). Other sort values: `ourTopPicks`, `priceHighestFirst`, `ratingHighToLow`, `topReviewed`, and more.

| `propertyType[]` | repeated: `hotels`, `resorts`, `guesthouses`, `bedAndBreakfast`, `apartments`, `entireHomesAndApartments`, `homestays` | everything except `hostels`. Accepted by the API (checked with one real search) |

Not every keyword is a real place: Booking.com guesses. `zzzz` returned apartments in Cascavel, Brazil, so HasData does not return an empty list for nonsense.

## Response fields we need (`results[]`)
| Our field | HasData field | Notes |
|---|---|---|
| id | `hotelId` | number |
| name | `title` | |
| total price | `price.pricePerStayParsed` | number, for the whole stay for the guests searched |
| currency | `price.currency` | `"INR"` |
| rating (0–10) | `reviews.score` | guest score. Missing (`reviews: {}`) when a hotel has no reviews yet |
| link | `url` | full booking.com URL, already has the dates and guests |

Do NOT use the top-level `rating`: it is the 1–5 star class of the hotel, not the guest score.

Also available, not used in v1: `price.excludedChargesParsed`, `price.priceBeforeDiscountParsed`, `location`, `photo`, `policies`, `reviews.count`.

## Answers
- **INR supported?** Yes. Send `currency=inr`; prices came back with `currency: "INR"`.
- **Rating 0–10?** Yes, `reviews.score` was 6.6 to 9.2 across the results. The star `rating` (3–5) is a different thing.
- **Price includes taxes?** No. Every result has `excludedChargesParsed` (about 5% or 18% of the price), shown as "excluded" taxes and charges on top. The app adds `excludedChargesParsed` to `pricePerStayParsed` and labels it "total incl. taxes & charges". If the charge is missing it shows the price with "+ taxes & charges".
