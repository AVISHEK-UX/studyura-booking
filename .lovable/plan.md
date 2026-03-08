

## Make Entire Mobile Header Bar Tappable

The user wants the whole rectangular header bar on mobile to act as a touch target that toggles the mobile menu (same as tapping the hamburger icon).

### Change

**File: `src/components/public/Header.tsx`**

Wrap the `<header>` element on mobile with an `onClick` handler that toggles `mobileOpen` state. Only apply this on mobile (`isMobile` is true). The hamburger icon remains visible as a visual indicator, but the entire bar becomes the tap target.

Specifically:
- Add `onClick={() => isMobile && setMobileOpen(!mobileOpen)}` to the header's inner flex container (the one with logo + hamburger)
- Add `cursor-pointer` class on mobile to indicate it's tappable
- Keep the hamburger button but make it non-interactive (`pointer-events-none`) on mobile since the parent handles the click

