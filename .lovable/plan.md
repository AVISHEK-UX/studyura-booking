

## Scroll-Expanding Library Grid Background

**Goal**: Initially the library section appears as a contained rounded card (like before), then as the user scrolls, it smoothly expands to cover the full viewport width and height.

### Approach

Use a scroll listener with `useState` to track scroll position. When scrolled past a threshold (e.g. 100px into the section), transition the `<main>` from a contained rounded card to a full-width background.

### Changes

**File: `src/pages/Index.tsx`**

1. Add a `useEffect` scroll listener that sets an `isExpanded` state to `true` when `window.scrollY` exceeds a threshold (around 300px)
2. Apply conditional classes to `<main>`:
   - **Not expanded**: `container mx-auto rounded-2xl bg-background/80 backdrop-blur-sm` (contained card look)
   - **Expanded**: `bg-background/95 backdrop-blur-sm rounded-t-3xl` (full-width cover)
3. Add CSS `transition-all duration-500` for smooth animation between states
4. Keep the inner `<div className="container">` for content centering in both states, adjusting padding accordingly

### Result
On load, the library grid appears as a floating rounded card over the hero. As the user scrolls down, it smoothly expands to fill the entire viewport width, covering the slideshow background completely.

