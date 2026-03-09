

## Fix: Only Background Expands on Scroll, Cards Stay Contained

The user wants:
- **Background** starts contained (with side gaps visible) and expands to full-width on scroll
- **Library cards/content** always stay in their contained `container` layout — no change to card sizing

Currently, the `container` class moves between `<main>` and inner `<div>`, which changes the card layout too.

### Fix in `src/pages/Index.tsx`

Wrap `<main>` in an outer `<div>` that handles the background expansion, while `<main>` itself always stays as `<div className="container">`:

```tsx
{/* Expanding background wrapper */}
<div className={`transition-all duration-500 ease-in-out backdrop-blur-sm ${
  isExpanded
    ? "bg-background/95 rounded-t-3xl py-10 sm:py-14"
    : "py-10 sm:py-14"
}`}>
  {/* Contained card (always same size) */}
  <main className={`container mx-auto transition-all duration-500 ${
    isExpanded ? "" : "rounded-2xl bg-background/80 p-6 sm:p-10"
  }`}>
    <h2>...</h2>
    {/* grid content */}
  </main>
</div>
```

- **Not scrolled**: outer wrapper has no background, inner `<main>` shows as a rounded card with `bg-background/80`
- **Scrolled**: outer wrapper gets full-width `bg-background/95`, inner card loses its own background/rounding (merges visually)
- Cards/content always stay within `container` width

