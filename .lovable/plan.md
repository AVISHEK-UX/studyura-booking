

## Redesign Crowd Meter on Library Card — Visual Meter Style

### Idea
Replace the current text-badge crowd meter on `LibraryCard` with a visual segmented meter inspired by the reference image. Each exam category gets a colored segment on a horizontal bar, with labels below — showing at a glance what students are preparing for and in what proportion.

### Changes

**`src/components/public/LibraryCard.tsx`** — Replace the crowd meter badges (lines 131-145) with a compact visual meter:

- Render a single horizontal bar (rounded pill) divided into colored segments proportional to each category's percentage
- Below the bar, show category labels with matching colored dots
- Use a gradient of brand colors (primary shades) for each segment
- Keep it compact — fits naturally in the card without adding bulk
- Only show when crowd_meter data exists with entries

**Visual layout:**
```text
┌──────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░ │  ← segmented bar
└──────────────────────────────────────┘
  ● UPSC 45%    ● SSC 30%    ● Banking 25%   ← labels with dots
```

### Technical Approach
- Sort categories by percentage descending
- Assign colors from a predefined palette array (e.g., primary, emerald, amber, violet)
- Each segment width = `percentage%` of the bar
- Labels rendered as a flex-wrap row with small colored dots
- Limit to top 4 categories max on the card for space

