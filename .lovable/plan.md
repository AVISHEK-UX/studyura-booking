

## Add Crowd Meter (Student Exam Categories) Feature

### Overview
Add a "crowd meter" section showing what exams the majority of students are preparing for (UPSC, SSC, Banking, etc.) — editable from the admin panel. Displayed as visual progress bars on the library detail page.

### Database Change
- Add a `crowd_meter` JSONB column (nullable, default null) to `libraries` table
- Format: `[{"label": "UPSC", "percentage": 40}, {"label": "SSC", "percentage": 30}, ...]`

### UI Changes

**`src/pages/LibraryDetail.tsx`** — Add a "Students Preparing For" section after Amenities:
- Section heading with a `GraduationCap` icon
- Each exam category shown as a labeled progress bar with percentage
- Color-coded bars (primary gradient) with rounded styling matching existing card design
- Only rendered when `crowd_meter` data exists and has entries

**`src/pages/admin/LibraryEdit.tsx`** — Add crowd meter management in admin form:
- A "Crowd Meter" section with ability to add/remove exam categories
- Each row: text input for label + number input for percentage (0-100)
- "Add Category" button to add new rows
- Simple, clean UI matching existing admin form patterns

**`src/components/public/LibraryCard.tsx`** — Optionally show top 2-3 exam tags as small badges on the card (subtle, non-intrusive)

### Data Flow
- Admin sets categories and percentages via the edit form
- Stored as JSONB in `crowd_meter` column
- Public pages read it and render progress bars

