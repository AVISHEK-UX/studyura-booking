

## Problem

The admin login redirects to the home page because of a **race condition** in the auth state management:

1. `signIn()` completes and correctly sets `isAdmin = true`
2. The admin login page navigates to `/admin/dashboard`
3. **But** `onAuthStateChange` also fires from the sign-in event, which sets `user` immediately but then starts an async `checkAdmin()` call
4. During that async gap, `AdminGuard` sees: `loading = false`, `user = exists`, `isAdmin = false` (not yet updated by the listener) -- and redirects to `/`

## Fix

### 1. Fix race condition in `useAuth.tsx`

Update `onAuthStateChange` to **set loading back to true** whenever a session change happens, preventing `AdminGuard` from making premature redirect decisions while the admin role check is still in progress.

```typescript
// In onAuthStateChange callback:
setUser(session?.user ?? null);
if (session?.user) {
  setLoading(true);  // <-- prevent premature guard decisions
  await checkAdmin(session.user.id);
}
setLoading(false);
```

### 2. Return admin status from `signIn` in `useAuth.tsx`

Make `signIn` return whether the user is an admin, so the admin login page can make a reliable navigation decision:

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error && data.user) {
    await checkAdmin(data.user.id);
  }
  return { error: error?.message ?? null, isAdmin: !error ? isAdmin : false };
};
```

### 3. Update `AdminLogin.tsx` navigation

After sign-in, wait briefly for state to propagate, or check the returned admin status before navigating. This ensures the guard won't see stale state.

### Files Changed
- `src/hooks/useAuth.tsx` -- fix race condition in `onAuthStateChange`, loading state management
- `src/pages/admin/Login.tsx` -- no functional change needed if the race condition fix works

