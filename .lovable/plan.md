

## Swipeable Photo Carousel with Image Counter

### Problem
The current `PhotoCarousel` uses arrow buttons for navigation. The user wants touch/swipe support (like other websites) and an image counter indicator (e.g., "1 / 3").

### Changes

**`src/components/public/PhotoCarousel.tsx`** — Replace the custom carousel with Embla Carousel (already installed) for native touch/swipe support:

- Use `embla-carousel-react` for swipe gesture handling (already a dependency)
- Remove the left/right arrow buttons
- Add an image counter label (e.g., "1 / 3") overlay at the bottom-right
- Keep the dot indicators at the bottom-center
- Maintain the rounded corners and aspect ratio styling

### Technical Approach
- Import `useEmblaCarousel` directly for lightweight usage with swipe
- Listen to `select` event to track current slide index
- Render counter as a small pill overlay: `"1 / 3"`
- Remove `ChevronLeft`/`ChevronRight` buttons entirely

