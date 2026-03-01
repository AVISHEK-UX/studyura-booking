

## Airbnb-Style Morphing Navbar

Transform the current static glassmorphism navbar into a two-state navbar that starts full-width with the brand's light gray/white theme color at the top, then morphs into a compact centered pill/oval shape on scroll.

### Behavior

**State 1 -- At Top (scrollY < 60)**
- Full-width navbar spanning the entire viewport
- Light gray-white background (matching the uploaded screenshot: `bg-[#e8e8e8]`)
- Regular height (~64-72px)
- Normal rectangular shape
- No shadow

**State 2 -- After Scroll (scrollY >= 60)**
- Compact, centered pill-shaped navbar (max-width ~900px, border-radius: 9999px)
- White/light background with soft shadow
- Smaller height (~52-56px)
- Subtle border and shadow for depth
- Smooth 250ms transition on width, height, border-radius, background, shadow, and padding

### What Changes

**1. Update `src/components/public/Header.tsx`**
- Add a `useEffect` scroll listener that toggles an `isScrolled` boolean when `scrollY >= 60`
- Respect `prefers-reduced-motion` -- skip animations if user prefers reduced motion
- Apply conditional classes to the `<header>` element:
  - Top state: full-width, light gray bg (`bg-[#e8e8e8]`), no rounded corners, no shadow
  - Scrolled state: `max-w-[900px] mx-auto rounded-full shadow-lg bg-white/95 backdrop-blur-xl` with top margin for spacing
- Wrap the header in a fixed container div so the pill can center itself
- Adjust inner padding/height to shrink in scrolled state
- Mobile: scrolled state remains near full-width but with rounded corners for usability
- Text colors adapt: muted tones in both states for readability against the light backgrounds

### Technical Details

- Scroll listener uses `requestAnimationFrame` or passive event listener for performance
- All animated properties use CSS `transition-all duration-250 ease-in-out`
- `z-50` stays on the outer wrapper to remain above the hero slideshow
- No layout shifts -- uses `fixed top-0` positioning with a wrapper
- The mobile hamburger menu and dropdown remain functional in both states
