

## Show Logged-In User Name in Header

### What Changes

**Header (`src/components/public/Header.tsx`)**:
- When a user is logged in, show their email (or name from metadata) alongside "My Bookings" in the nav
- Display a small user avatar/icon with their email truncated for clean UI
- The "Log In" link only appears when NOT logged in
- No logout button in the header -- user logs out only from the My Bookings page (as currently designed)

**Session Persistence** (already working):
- The authentication client is already configured with `persistSession: true` and `autoRefreshToken: true`, so users stay logged in across page refreshes until they explicitly log out. No changes needed here.

### Technical Details

**File: `src/components/public/Header.tsx`**
- Extract display name from `user.email` (show part before @) or `user.user_metadata?.full_name` if available
- When logged in, render: `[UserIcon] userName | [CalendarIcon] My Bookings`
- When logged out, render: `[UserIcon] Log In` (current behavior)
- Use a `DropdownMenu` or simple inline display for the user info

