

## Hide Google Login & Ensure Persistent Sessions

### Changes

**1. Hide Google Sign-In button (`src/components/ui/modern-stunning-sign-in.tsx`)**
- Remove the Google sign-in button (lines 139-164) from the form
- Remove `onGoogleSignIn` from the props interface (keep it optional so no other files break, but simply don't render the button)

**2. Remove Google handler from Login page (`src/pages/Login.tsx`)**
- Remove the `handleGoogleSignIn` function and the `onGoogleSignIn` prop passed to `SignIn1`
- Remove unused imports (`lovable`, `supabase`)

**3. Session persistence is already solid**
- The existing `useAuth` hook already calls `supabase.auth.getSession()` on mount and listens via `onAuthStateChange` for token refresh — sessions persist across page reloads
- The Supabase client is configured with `persistSession: true` and `autoRefreshToken: true`
- Users only log out when they click "Log Out" explicitly
- No changes needed here — the current implementation already handles this correctly

