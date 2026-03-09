## Mobile Bottom Navigation Bar with Favourites

### Overview

Add a fixed bottom navigation bar (mobile only) with three tabs: Home, My Bookings, and Favourites. The Favourites feature requires a new database table to persist user favorites, and a heart button on each LibraryCard to toggle favorites.

### Database Changes

**New table: `favourites**`

```sql
CREATE TABLE public.favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  library_id uuid NOT NULL REFERENCES public.libraries(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, library_id)
);

ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favourites"
  ON public.favourites FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites"
  ON public.favourites FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites"
  ON public.favourites FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
```

### New Components & Pages

1. `**src/components/public/BottomNav.tsx**` -- Fixed bottom bar, mobile only (hidden on `md:` and above). Three tabs with emoji-style icons:
  - 🏠 Home → navigates to `/`
  - 📅 My Bookings → navigates to `/my-bookings`
  - ❤️ Favourites → navigates to `/favourites`
  - Active tab highlighted with primary color
  - White background, border-top, safe-area padding for notched phones
2. `**src/hooks/useFavourites.ts**` -- Custom hook using react-query to fetch/toggle favourites from the `favourites` table. Provides `favourites`, `isFavourite(libraryId)`, and `toggleFavourite(libraryId)`.
3. `**src/pages/Favourites.tsx**` -- New page showing the user's favorited libraries in a grid (reusing `LibraryCard`). Shows empty state if none. Redirects to login if not authenticated.
4. `**src/components/public/LibraryCard.tsx**` -- Add a heart button (❤️) in the top-right corner of the card image. Tapping toggles the favourite. Filled red heart if favourited, outline heart if not. Requires `stopPropagation` so it doesn't navigate to the library detail page. If user is not logged in, redirect to login on tap.

### Routing

- Add `/favourites` route in `src/App.tsx`

### Layout Adjustments

- Add `<BottomNav />` to pages that need it (Index, LibraryDetail, MyBookings, Favourites) or place it globally in App.tsx with route-aware visibility
- Add `pb-20` (bottom padding) on mobile to prevent content being hidden behind the bottom nav
- The bottom do not replaces  some of the header nav functionality on mobile (My Bookings moves from header dropdown to bottom bar) it is same feature but extra 