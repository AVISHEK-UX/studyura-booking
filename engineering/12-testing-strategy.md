# 12 - Testing Strategy

## Testing Pyramid

```
        ┌─────────┐
        │  E2E    │  ← Manual / Browser tools (Lovable)
        │ (Few)   │
       ┌┴─────────┴┐
       │Integration │  ← React Testing Library + Vitest
       │ (Some)     │
      ┌┴────────────┴┐
      │   Unit Tests  │  ← Vitest
      │   (Many)      │
      └───────────────┘
```

## Unit Tests (Vitest)

### What to Test
| Module | Tests |
|--------|-------|
| `whatsapp.ts` | URL builder with various inputs, encoding, placeholder replacement |
| `utils.ts` | Utility functions |
| Type guards | Validate data shapes |
| Completeness score | Scoring logic (future) |

### Example
```typescript
// src/test/whatsapp.test.ts
import { buildWhatsAppUrl } from '@/lib/whatsapp';

describe('buildWhatsAppUrl', () => {
  it('should encode message correctly', () => {
    const url = buildWhatsAppUrl(
      { whatsapp_number: '919876543210', whatsapp_template: 'Hi {name}, booking {library}' },
      { name: 'John', library: 'ABC Library', date: '2026-03-01', shift: 'Morning' }
    );
    expect(url).toContain('wa.me/919876543210');
    expect(url).toContain('Hi%20John');
  });
});
```

## Integration Tests

### What to Test
| Component | Tests |
|-----------|-------|
| `LibraryCard` | Renders name, price, image |
| `BookingForm` | Validates required fields, builds correct URL |
| `LibraryGrid` | Renders correct number of cards |
| `AdminLogin` | Shows error on invalid credentials |
| `LibraryForm` | Submits correct data shape |

## End-to-End Tests (Manual via Lovable Browser Tools)

### Critical Flows
| # | Flow | Steps |
|---|------|-------|
| 1 | Student browses libraries | Open home → See grid → Cards load |
| 2 | Student views detail | Click card → Detail page → Photos load |
| 3 | Student books via WhatsApp | Fill form → Submit → WhatsApp opens |
| 4 | Admin logs in | Go to /admin → Enter credentials → Dashboard |
| 5 | Admin adds library | Dashboard → Add → Fill form → Save → Appears in listing |
| 6 | Admin toggles active | Dashboard → Toggle off → Library hidden from public |

## Test Coverage Goals

| Area | Target |
|------|--------|
| Utility functions | 90%+ |
| Components | 60%+ |
| Pages | Manual E2E |
| Overall | 70%+ |

## Running Tests
```bash
# Run all tests
bun run test

# Run specific file
bunx vitest run src/test/whatsapp.test.ts

# Watch mode
bunx vitest
```

## QA Checklist (Pre-Launch)
- [ ] All library cards render correctly on mobile, tablet, desktop
- [ ] Photo carousel swipes smoothly
- [ ] Booking form validates and redirects to WhatsApp
- [ ] WhatsApp message contains correct details
- [ ] Google Maps link opens correct location
- [ ] Admin login works with valid credentials
- [ ] Admin can add a new library with photos
- [ ] Admin can edit existing library
- [ ] Admin can delete library (with confirmation)
- [ ] Active/inactive toggle works
- [ ] Sort order reflects on public listing
- [ ] WhatsApp settings save and apply
- [ ] No console errors in production
- [ ] Images lazy load correctly
- [ ] Page load < 2 seconds on 4G
