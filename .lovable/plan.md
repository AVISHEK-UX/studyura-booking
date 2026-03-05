

## Add Back Button and Darken Privacy Policy Theme

### Changes

1. **`src/pages/PrivacyPolicy.tsx`** — Add a back button (using `lucide-react` ArrowLeft icon + react-router `useNavigate`) at the top, styled with the primary green theme. Darken the heading and section title colors to use a deeper green matching the app's accent/primary palette.

   - Add `import { useNavigate } from "react-router-dom"` and `ArrowLeft` icon
   - Add a back button before the title that navigates back (`navigate(-1)`)
   - Style section headings with deeper green (`text-primary` or accent color) instead of default `text-foreground`

