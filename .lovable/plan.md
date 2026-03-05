

## Increase Photo Carousel Image Size

### Change

**`src/components/public/PhotoCarousel.tsx`**
- Change the aspect ratio from `aspect-video` (16:9) to `aspect-[4/3]` — this makes the images taller and more prominent, better suited for the library photos shown in the screenshot.
- Apply the same change to the empty-state placeholder.

| File | Change |
|------|--------|
| `src/components/public/PhotoCarousel.tsx` | Replace `aspect-video` with `aspect-[4/3]` on lines 21 and 29 |

