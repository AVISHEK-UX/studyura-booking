# 03 - Information Architecture

## Site Map

```
/                          → Library Listing (Home)
/library/:id               → Library Detail + Booking Form
/admin/login               → Admin Login
/admin/dashboard            → Admin Library List
/admin/library/new          → Add Library
/admin/library/:id/edit     → Edit Library
/admin/settings             → WhatsApp Config
/*                          → 404 Not Found
```

## Navigation Structure

### Public Navigation
- **Header**: Logo / Brand Name | (no other nav items in MVP)
- **Home Page**: Grid of library cards → click → Detail page
- **Detail Page**: Back to listing | Library info | Booking CTA

### Admin Navigation
- **Sidebar**: Dashboard | Add Library | Settings | Logout
- **Dashboard**: Table of libraries with actions (Edit, Delete, Toggle)

## Content Hierarchy

### Library Card (Listing)
1. Cover Photo
2. Library Name
3. Price (e.g., ₹1500/month)
4. Address (truncated)

### Library Detail Page
1. Photo Carousel
2. Library Name (H1)
3. Address + Google Maps link
4. Pricing table
5. Shifts available
6. Amenities (icon list)
7. Booking Form (inline or modal)

### Booking Form
1. Student Name *
2. Phone (optional)
3. Preferred Date *
4. Shift Selection *
5. Submit → WhatsApp

## Data Relationships

```
Library (1) ──── (N) Photos
Config (1) ──── WhatsApp Settings (singleton)
```
