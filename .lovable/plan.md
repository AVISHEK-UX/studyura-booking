

## Add "Seats Left" Feature

### Overview
Add a `seats_left` column to the `libraries` table, display it on both the home page library cards and library detail page, and provide an input field in the admin panel to manage it.

### Database Migration
- Add `seats_left` integer column to `libraries` table (nullable, default null — when null, badge is hidden)

### UI Changes

**1. Library Card (Home Page) — `src/components/public/LibraryCard.tsx`**
- Show a "X seats left" badge on the card image (bottom-left or top-right), similar to the discount badge
- Use a distinct color (e.g., amber/orange background) to differentiate from the discount badge
- Only show when `seats_left` is not null

**2. Library Detail Page — `src/pages/LibraryDetail.tsx`**
- Show a "X seats left" indicator near the library name or in the booking sidebar
- Use an icon (e.g., `Users` from lucide) with the count

**3. Admin Library Edit — `src/pages/admin/LibraryEdit.tsx`**
- Add a "Seats Left" number input field in the form
- Include it in the save mutation data

**4. Admin Dashboard — `src/pages/admin/Dashboard.tsx`**
- Show seats left count in both mobile card view and desktop table view for quick visibility

### Files to Change
| File | Change |
|------|--------|
| DB migration | `ALTER TABLE libraries ADD COLUMN seats_left integer DEFAULT NULL` |
| `src/components/public/LibraryCard.tsx` | Add seats left badge on card image |
| `src/pages/LibraryDetail.tsx` | Show seats left indicator |
| `src/pages/admin/LibraryEdit.tsx` | Add seats left input field + include in save |
| `src/pages/admin/Dashboard.tsx` | Show seats left in table/cards |

