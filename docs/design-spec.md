# Hotel Finder: Design Spec (from Figma "SearchHotel")

Source: Figma file `9sqgXhTZu2zGrt7lqVoazt`, frames read ONCE. Don't re-fetch unless asked.
Screenshots (local): see Figma MCP tool-results cache; not needed to build.

## Global tokens
- Font: Inter (Regular 400, Medium 500, Semi Bold 600, Bold 700)
- Page: white background, content column 550px wide, left offset 136px (centre it in the app), top padding 21px
- Colors
  - Text strong `#111827`; label `#374151`; muted `#6b7280`; placeholder `#9ca3af`
  - Border `#d1d5db`; error `#ef4444`; primary blue `#2563eb`; white `#ffffff`
- Radius 8px for inputs, buttons and cards
- Inputs: height 36px, padding 8px 12px, 1px border `#d1d5db`, white bg, text 14px/20px
- Icons: 20x20 (calendar, chevron-down), from Figma assets (download needed, not saved yet)

## Screen 1: Search Page (frame "Search Page", 3:4)
Container "Hotel Finder Form" (6:4): 550px wide, vertical stack, gap 10px.

1. **Header** (6:5), gap 4px
   - Title "Hotel Finder": Inter Bold 28px / line 34px, `#111827`
   - Subtitle "Find the 3 cheapest good hotels for your trip": Regular 14/20, `#6b7280`
2. **Destination Field** (6:8), gap 4px
   - Label "Destination": Semi Bold 14/20, `#374151`
   - Destination Input (6:10): placeholder "e.g. Goa" (`#9ca3af`). Error state shown in design: border `#ef4444`
   - Error text "Please enter a destination": Medium 12/16, `#ef4444`
3. **Dates Row** (6:13): two equal-width fields, gap 16px
   - Check-in Field (6:14): label "Check-in"; Check-in Input (6:16) shows "29 Oct 2026 (Today)", calendar icon at right (space-between)
   - Check-out Field (6:19): label "Check-out"; Check-out Input (6:21) shows "30 Oct 2026", calendar icon at right
4. **Stay Details** (6:24): text "1 night", Regular 12/16, `#6b7280` (computed nights)
5. **Guests Row** (6:26): two equal-width fields, gap 16px
   - Adults Field (6:27): label "Adults"; Adults Input (6:29) default "1"
   - Children Field (6:31): label "Children"; Children Input (6:33) default "0"
6. **Child Age Field** (6:35), gap 4px (one per child; appears when Children > 0)
   - Label "Child 1 age" (Semi Bold 14/20, `#374151`)
   - Child Age Dropdown (6:37): placeholder "Select age (0–17)" (`#9ca3af`), chevron-down icon right
   - Helper "One age field appears for each child": Regular 12/16, `#6b7280`
7. **Search Button** (6:41): full width, height 38px, bg `#2563eb`, radius 8px, label "Search" Semi Bold 14/20 white, centred

## Screen 2: Results Page (frame "Results Page", 8:3)
Container: vertical stack, gap 16px, padding 21px 136px 24px (content column about 550px).

1. **Results Header** (8:4), gap 8px
   - Trip Summary (8:5), gap 4px
     - Title "Top 3 cheapest hotels": Bold 28/34, `#111827`
     - Summary line e.g. "Goa · 29–30 Oct 2026 · 1 night · 2 adults, 1 child": Regular 14/20, `#6b7280`
   - Link "← New search": Medium 14/20, `#2563eb`
2. **Hotel Results** (8:9): vertical list, gap 12px, 3 cards
   - Hotel Card (8:10, 8:18, 8:26): white bg, 1px border `#d1d5db`, radius 8px, padding 16px, inner gap 8px
     - Row "Hotel and total" (space-between, centred vertically)
       - Hotel name: Bold 16/22, `#111827`
       - Price: amount Bold 18/22 `#111827` (e.g. "₹4,200") + " total stay" Regular 12/22 `#6b7280`
     - Row "Rating and booking" (space-between, centred vertically)
       - Rating: score Semi Bold 14/20 `#111827` + " / 10 rating" Regular 14/20 `#6b7280` (e.g. "8.2 / 10 rating")
       - View Button: height 36px, padding 0 16px, bg `#2563eb`, radius 8px, text "View on Booking.com" Semi Bold 14/20 white (links to the hotel)
   - Sample data in the design: Sea View Resort ₹4,200 / 8.2; Palm Stay ₹4,550 / 7.8; Beach Inn ₹4,800 / 7.4
3. **State Examples** (8:34): messages, gap 12px, Regular 12/16 `#6b7280`, with Semi Bold 12/16 captions
   - Empty state text: "No hotels found. Try different dates or a different destination."
   - Error state text: "Something went wrong. Please try again."

## Notes / differences to check against the PRD (PRD wins)
- Design shows currency ₹ (INR); the PRD doesn't name a currency. Decide before the real API step.
- Dates in the design are formatted "29 Oct 2026"; check-in default is today, check-out default is the next day.
- Design has no loading state; add a simple one if needed.
