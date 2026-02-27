# 01 - Product Requirements

## 1. Objective
Enable library discovery and WhatsApp-based booking enquiry for students seeking study spaces.

## 2. Target Users
| User Type | Description |
|-----------|-------------|
| Student | Discovers libraries, views details, sends booking enquiry via WhatsApp |
| Admin | Manages library listings, photos, ordering, and WhatsApp configuration |

## 3. Functional Requirements

### 3.1 Public-Facing
| ID | Requirement | Priority |
|----|------------|----------|
| PR-01 | Library listing grid with image slider | P0 |
| PR-02 | Library detail page (photos, amenities, pricing, shifts) | P0 |
| PR-03 | Booking enquiry form (name, date, shift) | P0 |
| PR-04 | WhatsApp redirect with prefilled message | P0 |
| PR-05 | Google Maps link for directions | P1 |
| PR-06 | Search / filter libraries | P2 |
| PR-07 | Mobile-first responsive layout | P0 |

### 3.2 Admin Panel
| ID | Requirement | Priority |
|----|------------|----------|
| AR-01 | Admin login (email + password) | P0 |
| AR-02 | Add / Edit / Delete library | P0 |
| AR-03 | Upload & manage photos per library | P0 |
| AR-04 | Set sort order for listing | P0 |
| AR-05 | Active / Inactive toggle | P0 |
| AR-06 | Configure WhatsApp number & message template | P0 |

## 4. Non-Functional Requirements
- Page load < 2 seconds on 4G
- Lazy-loaded images
- Mobile-first design
- Accessible (WCAG 2.1 AA)

## 5. Out of Scope (MVP)
- Payments / transactions
- Seat availability engine
- Student login / accounts
- Reviews & ratings
- Push notifications
