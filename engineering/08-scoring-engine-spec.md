# 08 - Scoring Engine Spec

## Overview
The scoring engine determines library display order and optional relevance ranking for future search/filter features.

## Current MVP: Sort Order
In MVP, ordering is manual via the `sort_order` integer field.

| Rule | Description |
|------|-------------|
| Primary sort | `sort_order` ASC (lower = higher position) |
| Tie-breaker | `name` ASC (alphabetical) |
| Filter | Only `is_active = true` libraries shown |

```sql
SELECT * FROM libraries
WHERE is_active = true
ORDER BY sort_order ASC, name ASC;
```

## Future: Relevance Scoring (Post-MVP)

When search/filter is introduced, a composite score can be calculated:

### Score Components
| Factor | Weight | Description |
|--------|--------|-------------|
| Admin boost | 40% | Manual `sort_order` (normalized) |
| Completeness | 20% | Profile completeness (photos, amenities, pricing filled) |
| Recency | 15% | Recently updated libraries rank higher |
| Engagement | 25% | WhatsApp click-through rate (tracked via events) |

### Completeness Score Calculation
```typescript
function completenessScore(library: Library): number {
  let score = 0;
  if (library.photos.length > 0) score += 30;
  if (library.photos.length >= 3) score += 20;
  if (library.amenities.length > 0) score += 20;
  if (library.google_maps_url) score += 15;
  if (Object.keys(library.pricing).length > 0) score += 15;
  return score; // 0-100
}
```

### Implementation Note
Scoring engine is **out of scope for MVP**. Manual `sort_order` is sufficient for initial launch.
