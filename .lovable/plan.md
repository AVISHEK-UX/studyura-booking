

## Problem

The admin login redirect fails due to a **double-firing race condition**:

1. `signIn()` calls `checkAdmin()` and returns `isAdmin: true`
2. Admin login page calls `navigate("/admin/dashboard")`
3. **Simultaneously**, `onAuthStateChange` fires from the sign-in event, which sets `loading = true` and starts **another** async `checkAdmin()` call
4. During this second check, `AdminGuard` may briefly see `loading = false` + `isAdmin = false` and redirect to `/`

The "waking up server" hint appears because the `signIn` function makes **two** redundant RPC calls to `has_role` (one via `checkAdmin`, another directly), doubling the server round-trips.

## Fix

### 1. Prevent redundant admin checks in `signIn` (`src/hooks/useAuth.tsx`)

Remove the duplicate `has_role` RPC call. Instead, after `checkAdmin` completes (which sets `isAdmin` state), read the result directly from a local variable rather than making a second RPC call.

### 2. Skip `onAuthStateChange` re-check during active sign-in (`src/hooks/useAuth.tsx`)

Add a ref (`signingIn`) that is set to `true` during `signIn()` and `false` after. The `onAuthStateChange` listener will skip its `checkAdmin` call when the ref is true, since `signIn` already handled it. This eliminates the race condition entirely.

```text
signIn() starts --> signingIn = true
  |-> checkAdmin() --> sets isAdmin
  |-> returns { isAdmin }
  |-> signingIn = false

onAuthStateChange fires:
  if signingIn.current --> skip checkAdmin (already done)
  else --> proceed normally (e.g., page refresh, token refresh)
```

### 3. No changes needed to `AdminLogin.tsx` or `AdminGuard.tsx`

The existing login page and guard logic are correct -- the issue is purely in the auth state management.

### Files Changed
- `src/hooks/useAuth.tsx` -- Add `signingIn` ref, simplify `signIn` to remove duplicate RPC, skip redundant `onAuthStateChange` check during sign-in

