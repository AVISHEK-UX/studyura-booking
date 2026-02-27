# 02 - User Stories & Acceptance Criteria

## Student Stories

### US-01: Browse Libraries
**As a** student, **I want to** see a grid of available libraries **so that** I can choose one to study at.

**Acceptance Criteria:**
- [ ] Libraries displayed in a responsive grid (mobile: 1 col, tablet: 2, desktop: 3)
- [ ] Each card shows: name, cover photo, pricing, address snippet
- [ ] Only active libraries are shown
- [ ] Libraries sorted by `sortOrder` ascending
- [ ] Images lazy-loaded

### US-02: View Library Details
**As a** student, **I want to** view full details of a library **so that** I can decide if it suits me.

**Acceptance Criteria:**
- [ ] Photo carousel/slider with all library photos
- [ ] Full address, pricing, shifts, amenities displayed
- [ ] Google Maps link opens in new tab
- [ ] "Book via WhatsApp" CTA is prominent

### US-03: Submit Booking Enquiry
**As a** student, **I want to** fill a booking form and be redirected to WhatsApp **so that** I can enquire about a seat.

**Acceptance Criteria:**
- [ ] Form fields: Name, Phone (optional), Preferred Date, Shift
- [ ] Validation on required fields
- [ ] On submit → redirect to `wa.me` with prefilled message
- [ ] Message includes library name, student name, date, shift

### US-04: Get Directions
**As a** student, **I want to** open Google Maps for a library **so that** I can navigate there.

**Acceptance Criteria:**
- [ ] "Get Directions" button visible on detail page
- [ ] Opens Google Maps URL in new tab

---

## Admin Stories

### US-05: Admin Login
**As an** admin, **I want to** log in securely **so that** I can manage listings.

**Acceptance Criteria:**
- [ ] Email + password login form
- [ ] Invalid credentials show error
- [ ] Successful login redirects to admin dashboard
- [ ] Session persists across page reloads

### US-06: Manage Libraries
**As an** admin, **I want to** add, edit, and delete libraries **so that** listings stay current.

**Acceptance Criteria:**
- [ ] Add library form with all fields (name, address, pricing, shifts, amenities, maps URL, sort order)
- [ ] Edit pre-fills existing data
- [ ] Delete requires confirmation dialog
- [ ] Changes reflect on public dashboard immediately

### US-07: Manage Photos
**As an** admin, **I want to** upload and remove photos for each library.

**Acceptance Criteria:**
- [ ] Upload multiple images (max 5 MB each, jpg/png/webp)
- [ ] Drag to reorder photos
- [ ] Delete individual photos
- [ ] First photo used as cover on listing card

### US-08: Control Listing Order
**As an** admin, **I want to** set sort order **so that** featured libraries appear first.

**Acceptance Criteria:**
- [ ] Numeric `sortOrder` field per library
- [ ] Lower number = higher position
- [ ] Ties broken alphabetically

### US-09: Toggle Active Status
**As an** admin, **I want to** activate/deactivate a library without deleting it.

**Acceptance Criteria:**
- [ ] Toggle switch on admin list
- [ ] Inactive libraries hidden from public view
- [ ] Visual indicator in admin panel

### US-10: Configure WhatsApp
**As an** admin, **I want to** set the WhatsApp number and message template.

**Acceptance Criteria:**
- [ ] Settings page with phone number input (with country code)
- [ ] Editable message template with placeholders: `{name}`, `{library}`, `{date}`, `{shift}`
- [ ] Preview of generated message
