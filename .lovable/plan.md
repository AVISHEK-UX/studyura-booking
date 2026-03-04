

## Add Location/Address Search to Home Page

### Change

**`src/pages/Index.tsx`**
- Update the search filter logic so the "Search" input matches against both `library.name` AND `library.address` (case-insensitive)
- Update the placeholder from "Library name" to "Library name or location"

This is a single-line filter change — currently it only checks `lib.name`, we add `|| lib.address?.toLowerCase().includes(...)`.

### Files to Change
| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Update filter to include address matching + update placeholder text |

