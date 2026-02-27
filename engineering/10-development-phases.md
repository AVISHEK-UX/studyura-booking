# 10 - Development Phases

## Phase 1: Foundation (Day 1)
**Goal:** Project setup, design system, database schema

### Tasks
- [ ] Set up design system (colors, typography, spacing) in `index.css` + `tailwind.config.ts`
- [ ] Enable Lovable Cloud
- [ ] Create database tables (`libraries`, `app_config`)
- [ ] Set up RLS policies
- [ ] Create storage bucket for photos
- [ ] Define TypeScript interfaces
- [ ] Create Supabase client helper

### Deliverable
Backend ready, design tokens defined, no UI yet.

---

## Phase 2: Public Pages (Day 2)
**Goal:** Student-facing library listing and detail pages

### Tasks
- [ ] Build `Header` component
- [ ] Build `LibraryCard` component
- [ ] Build `LibraryGrid` with responsive layout
- [ ] Build library listing page (`Index.tsx`)
- [ ] Build `PhotoCarousel` component
- [ ] Build library detail page (`LibraryDetail.tsx`)
- [ ] Add Google Maps link
- [ ] Implement React Query hooks for data fetching
- [ ] Seed database with 3-5 sample libraries

### Deliverable
Students can browse and view library details.

---

## Phase 3: Booking Flow (Day 2-3)
**Goal:** WhatsApp booking enquiry

### Tasks
- [ ] Build `BookingForm` component
- [ ] Build WhatsApp URL builder utility
- [ ] Fetch `app_config` for WhatsApp number/template
- [ ] Integrate form submission → WhatsApp redirect
- [ ] Test with real WhatsApp number

### Deliverable
Complete student flow: Browse → View → Book via WhatsApp.

---

## Phase 4: Admin Panel (Day 3-4)
**Goal:** Admin can manage all library data

### Tasks
- [ ] Build admin login page
- [ ] Set up auth guard for admin routes
- [ ] Build admin dashboard with library table
- [ ] Build library add/edit form
- [ ] Implement photo upload to storage
- [ ] Build sort order control
- [ ] Build active/inactive toggle
- [ ] Build WhatsApp settings page

### Deliverable
Admin can fully manage library listings.

---

## Phase 5: Polish & Launch (Day 5)
**Goal:** Final testing, performance, deployment

### Tasks
- [ ] End-to-end testing of all flows
- [ ] Performance optimization (lazy loading, image compression)
- [ ] SEO meta tags
- [ ] Error handling & empty states
- [ ] Mobile responsiveness audit
- [ ] Deploy to production

### Deliverable
Production-ready MVP.
