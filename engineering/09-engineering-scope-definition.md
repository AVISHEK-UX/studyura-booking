# 09 - Engineering Scope Definition

## In Scope (MVP)

### Frontend
- [x] Public library listing page (responsive grid)
- [x] Library detail page with photo carousel
- [x] Booking enquiry form with WhatsApp redirect
- [x] Google Maps link integration
- [x] Admin login page
- [x] Admin dashboard (library CRUD)
- [x] Admin photo upload & management
- [x] Admin sort order control
- [x] Admin active/inactive toggle
- [x] Admin WhatsApp configuration
- [x] Mobile-first responsive design
- [x] Lazy loading for images

### Backend (Lovable Cloud)
- [x] Database tables: `libraries`, `app_config`
- [x] Row Level Security policies
- [x] Authentication (email + password)
- [x] Storage bucket for library photos
- [x] Public read access for active libraries

### DevOps
- [x] Lovable hosting (auto-deploy)
- [x] Preview environments via Lovable

## Out of Scope (MVP)

| Feature | Reason | Phase |
|---------|--------|-------|
| Payments / Stripe | Not needed for enquiry model | v2 |
| Seat availability engine | Complex real-time logic | v2 |
| Student accounts / login | Frictionless WhatsApp preferred | v2 |
| Reviews & ratings | Needs moderation system | v2 |
| Push notifications | Requires service worker setup | v2 |
| Multi-language support | Single market launch | v2 |
| Analytics dashboard | Use external tools initially | v2 |
| Email notifications | WhatsApp is primary channel | v2 |
| PWA / offline support | Not critical for MVP | v3 |

## Effort Estimates

| Module | Estimated Effort | Complexity |
|--------|-----------------|------------|
| Design system + tokens | 2 hours | Low |
| Public listing page | 3 hours | Medium |
| Library detail page | 3 hours | Medium |
| Booking form + WhatsApp | 2 hours | Low |
| Admin authentication | 1 hour | Low |
| Admin CRUD | 4 hours | Medium |
| Photo upload | 3 hours | Medium |
| Settings page | 1 hour | Low |
| Database + RLS | 2 hours | Medium |
| Testing | 2 hours | Low |
| **Total** | **~23 hours** | |
