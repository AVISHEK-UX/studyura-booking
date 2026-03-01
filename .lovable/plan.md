

## Integrate Modern Animated Footer

Add a branded footer component to the Index page, replacing the current simple footer. Adapted from the provided Next.js component to work with React Router and the studyura brand.

### What Changes

**1. Copy uploaded logo to `src/assets/logo-2.png`**
- The user uploaded a new green hexagonal "S" logo that will be used in the footer's bottom logo section.

**2. Create `src/components/ui/modem-animated-footer.tsx`**
- Port the provided Next.js footer component to React Router (replace `next/link` with `react-router-dom` `Link`)
- Remove the `next` dependency entirely -- it's not needed
- Keep all Tailwind styling, animations, and layout structure
- Uses `lucide-react` icons (already installed)
- The component accepts props for brand name, description, social links, nav links, and brand icon

**3. Update `src/pages/Index.tsx`**
- Replace the current simple `<footer>` block (lines 249-254) with the new `Footer` component
- Configure it with studyura branding:
  - Brand name: "studyura"
  - Brand description: "Find your perfect study space."
  - Social links: Customer care phone (8881189088) and email (studyura.helpdesk@gmail.com) only -- no social media
  - Nav links: relevant app pages (e.g., Home, My Bookings, Login)
  - Brand icon: the uploaded studyura logo (`logo-2.png`)

### Technical Details

- **No new npm dependencies** -- `next` is NOT installed; the component is converted to use `react-router-dom` `Link` (already installed) and standard `<a>` tags for external links
- `lucide-react` is already installed -- uses `Phone` and `Mail` icons for customer support links
- The large background text watermark will display "STUDYURA"
- The footer's dark theme (zinc/neutral backgrounds) will contrast with the main page, creating a clear visual separation
- The component uses `cn()` from `@/lib/utils` for class merging (already available)

