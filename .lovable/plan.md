

## Move Recently Viewed Inside the Expanding Background

Currently, `RecentlyViewedSection` sits **above** the expanding background `<div>`. The fix is simple: move it **inside** that wrapper so it shares the same `bg-background/95` backdrop.

### Change in `src/pages/Index.tsx`

Move the `RecentlyViewedSection` render from lines 217-220 (above the grid wrapper) to inside the expanding background div (after line 227, before `<main>`):

```text
Before:
  RecentlyViewedSection          ← outside background
  <div bg-background wrapper>   ← expanding background
    <main> grid </main>
  </div>

After:
  <div bg-background wrapper>   ← expanding background
    RecentlyViewedSection        ← now inside
    <main> grid </main>
  </div>
```

- Remove the `RecentlyViewedSection` from its current position (lines 217-220)
- Place it inside the expanding background `<div>` at lines 223-227, right before `<main>`
- The section's existing `container` class will keep content properly contained

