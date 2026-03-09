

## Recently Viewed Libraries Section

### Overview
Add a "Recently viewed" horizontal scrollable section between the "Near me" button and the library grid. It tracks which libraries a user clicks on (navigates to detail page), stores IDs in `localStorage`, and displays them as compact horizontally-scrollable cards (like the Airbnb reference screenshots).

### Approach

**No database changes needed** -- recently viewed is local/session data stored in `localStorage`.

### Changes

1. **New hook: `src/hooks/useRecentlyViewed.ts`**
   - Reads/writes an array of library IDs from `localStorage` key `recently_viewed`
   - `addRecentlyViewed(id)` -- pushes to front, deduplicates, caps at ~10
   - `recentlyViewedIds` -- the stored array
   - Returns the IDs so the Index page can filter libraries by them

2. **`src/components/public/LibraryCard.tsx`** (or `src/pages/LibraryDetail.tsx`)
   - On library detail page mount, call `addRecentlyViewed(library.id)` to record the visit
   - Best place: `LibraryDetail.tsx` since that's the actual "view" event

3. **`src/pages/Index.tsx`**
   - Import `useRecentlyViewed` hook
   - Between the "Near me" chip and the library grid wrapper, render a "Recently viewed >" section
   - Only show if `recentlyViewedIds.length > 0`
   - Filter `libraries` by the recently viewed IDs to get full library objects
   - Render as a horizontal scroll container with compact cards:
     - `overflow-x-auto`, `flex`, `gap-3`, `snap-x` for native horizontal scroll
     - Each card: small thumbnail (rounded-lg), library name, city, with heart button
     - Card width ~40vw on mobile (so 2+ visible, hinting at scroll)
   - Style inspired by the Airbnb reference: rounded image, name below, compact layout

### Card Design (Recently Viewed)
- Rounded square thumbnail (~aspect-square, ~150px wide)
- Heart button in top-right corner (reuse favourite toggle)
- Library name below image (1 line, truncated)
- City + price below name in muted text
- Wrapped in a `<Link to={/library/${id}}>` 

### Layout Position
```text
Hero Section
  Search Bar
  [Near me] button
  
  "Recently viewed >"  (horizontal scroll)
  [card] [card] [card] [card] →

Library Grid (expanding background)
  Available Libraries
  [grid cards...]
```

