

## Expand Library Grid Background to Cover Full Width

The screenshots show the library grid section has a rounded container (`rounded-2xl bg-background/80`) with the hero slideshow visible behind it on the sides and bottom. The user wants this background to stretch edge-to-edge so it covers all remaining space.

### Change

**File: `src/pages/Index.tsx`** (lines 202-204)

Replace the current `<main>` with a full-width background wrapper, moving the container inside:

- Change `<main className="container py-10 sm:py-14">` to `<main className="bg-background/95 backdrop-blur-sm py-10 sm:py-14">`  — full-width background, no container constraint
- Change the inner `<div className="rounded-2xl bg-background/80 backdrop-blur-sm p-6 sm:p-10">` to `<div className="container">` — just use container for content centering, remove the rounded card styling
- Add `rounded-t-3xl` to `<main>` for a subtle top-edge curve that overlaps the hero nicely

Result: The background fills the entire viewport width and extends to the bottom, covering the slideshow completely once the user scrolls past the hero.

