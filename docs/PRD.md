# Hotel Finder: PRD (v1)

1. **Goal:** help a traveler see the 3 cheapest good hotels for their trip, quickly.
2. **User:** anyone planning a hotel stay.
3. **Search form:** destination, check-in date, check-out date, number of adults, number of children, and the age of each child (0–17). Dates are picked from a calendar. Default: check-in is today, check-out is tomorrow (1 night). If check-in is moved to on or after check-out, check-out becomes check-in + 1 day. Past dates can't be selected. Dates are sent to the data source as YYYY-MM-DD.
4. **Form checks:** destination is required, at least 1 adult, and check-out must be after check-in. If a check fails, show a short message saying what to fix.
5. **Getting hotels:** the app asks Booking.com (through HasData) for matching hotels. This happens only on the server, never in the browser.
6. **Minimum rating:** hide hotels rated below 7.0 out of 10.
7. **Sorting:** order the remaining hotels by total price for the whole stay, cheapest first.
8. **Results:** show the top 3, each with name, total price, rating and a link to the hotel. Prices are shown in INR.
9. **Edge cases:** while searching, show a simple loading indicator. If fewer than 3 hotels qualify, show what was found. If none qualify, show "No hotels found". If the data source fails, show a friendly "Please try again" message.
10. **Future scope (not in v1):** no maps, photos, extra filters, logins or saved favorites. New ideas get listed here instead of being built.

## Decisions (v1)

1. **Rating:** scale is 0–10. Hide hotels with no rating.
2. **Currency:** request INR. If HasData doesn't support it, show the returned currency clearly labeled. Don't convert, and tell the product owner.
3. **Price:** assume 1 room. Label prices "total for stay". Say "incl. taxes" only if the data confirms it.
4. **Results depth:** one page of HasData results is enough for v1.
5. **Destination:** free text is fine.
6. **Dates:** use the browser's built-in date picker, no new library.
7. **Guest limits:** max 10 adults and 10 children. Keep form values after a search and after "New search".
8. **Missing data:** skip hotels with no price or link.
9. **Taxes (replaces the price label in decision 3):** if HasData returns the excluded charges, add them to the price and label it "total incl. taxes & charges". If an amount is missing, show the price with a small "+ taxes & charges" note.
10. **Property types:** exclude hostels and dorms. Keep hotels, guesthouses, apartments and similar. Families shouldn't be shown dorm beds.
11. **Where the hotels are:** never hide results because they don't match the typed destination. Always show them, with a line above the list: "Showing hotels in <cities from the results>" (the distinct cities of the hotels shown, e.g. "Showing hotels in Calangute, Candolim and Baga"), so the traveler can see where the hotels really are. Show "No hotels found" only when there are no hotels to show. HasData returns a guessed place even for nonsense like "zzzz", so the line is the safeguard. (This replaces the earlier destination-match check, which hid valid Goa results.)
12. **Tie-break:** when two hotels have the same total price, show the higher-rated one first.
