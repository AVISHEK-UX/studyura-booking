

## Integrate Modern Stunning Sign-In Page

Replace the current Login page with a modern glassmorphic sign-in design, adapted to the studyura brand and green theme.

### What Changes

**1. Create `src/components/ui/modern-stunning-sign-in.tsx`**
- A full-screen sign-in component with a dark gradient background using the project's green palette (`hsl(152 32% 36%)`)
- Glassmorphic card with backdrop blur, green-tinted borders
- StudyUra logo (from `src/assets/logo.png`) instead of "HextaUI"
- Brand text: "studyura" in lowercase
- Email and password inputs with green focus rings
- "Sign in" button in primary green
- "Continue with Google" button (styled, non-functional placeholder)
- "Don't have an account? Sign up" link that toggles to signup mode
- Avatar row at bottom: "Join thousands of students who are already using studyura"
- Avatars filled with Unsplash stock portrait URLs

**2. Update `src/pages/Login.tsx`**
- Replace the current plain form layout with the new modern sign-in component
- Keep all existing auth logic (useAuth, redirect, signIn/signUp, error/success handling)
- Pass auth handlers as props to the new component
- Support both login and signup modes within the glassmorphic card
- Remove the Header component (the new design is full-screen standalone)

### Technical Details

- No new dependencies needed -- uses only React, Tailwind classes, lucide-react icons, and the existing logo asset
- The component uses inline Tailwind for all styling (gradient backgrounds, backdrop-blur, border opacity)
- Inputs will use custom classes rather than the shadcn Input component to match the dark glassmorphic aesthetic
- The sign-up mode adds Full Name and Confirm Password fields inside the same card
- Color mapping: all accent colors use CSS variable `--primary` (green) or direct `hsl(152 32% 36%)` references
- Responsive: card is max-w-md centered, full-height viewport with overflow-auto for small screens

