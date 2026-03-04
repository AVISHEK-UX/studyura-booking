

## Add Color-Coded "Seats Left" to Library Detail Page

### Changes

**`src/pages/LibraryDetail.tsx`**
- Update the existing seats left badge near the library name to use color-coded urgency:
  - **Red** (`bg-red-500`): less than 5 seats
  - **Amber** (`bg-amber-500`): 5–15 seats
  - **Green** (`bg-emerald-500`): more than 15 seats

**`src/components/public/LibraryCard.tsx`**
- Apply the same color-coding logic to the home page card badge

### Color Logic
```text
seats < 5   → red bg    (urgent)
seats 5-15  → amber bg  (moderate)
seats > 15  → green bg  (plenty)
```

### Files to Change
| File | Change |
|------|--------|
| `src/pages/LibraryDetail.tsx` | Color-code the existing seats left badge |
| `src/components/public/LibraryCard.tsx` | Color-code the card seats left badge |

