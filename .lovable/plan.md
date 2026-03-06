

## Fix Google OAuth on Hostinger + Add .htaccess

### Problem
On a custom domain (Hostinger), the `lovable.auth.signInWithOAuth` flow fails because Lovable's auth-bridge only works on `*.lovable.app` domains. The OAuth redirect gets intercepted and breaks.

### Solution — Two Changes

**1. `src/pages/Login.tsx`** — Detect custom domain and bypass auth-bridge:
- If hostname is NOT `lovable.app` or `lovableproject.com`, use `supabase.auth.signInWithOAuth` directly with `skipBrowserRedirect: true`
- Validate the returned OAuth URL points to `accounts.google.com` before redirecting
- On Lovable domains, keep using `lovable.auth.signInWithOAuth` as-is

```typescript
const handleGoogleSignIn = async () => {
  setError("");
  const isCustomDomain =
    !window.location.hostname.includes("lovable.app") &&
    !window.location.hostname.includes("lovableproject.com");

  if (isCustomDomain) {
    // Bypass auth-bridge — direct Supabase OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true,
      },
    });
    if (error) { setError(error.message); return; }
    if (data?.url) {
      const url = new URL(data.url);
      if (url.hostname !== "accounts.google.com") {
        setError("Invalid OAuth redirect"); return;
      }
      window.location.href = data.url;
    }
  } else {
    // Lovable domain — use managed auth-bridge
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      setError(result.error instanceof Error ? result.error.message : String(result.error));
    }
  }
};
```

**2. `public/.htaccess`** — Create for Hostinger (Apache) to handle SPA routing:
- Rewrite all non-file requests to `index.html` so React Router works on refresh/deep links

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Important
You must also ensure your custom domain (e.g. `https://yourdomain.com`) and redirect URL (`https://yourdomain.com/**`) are added in your backend's authentication settings. You can do this from the Lovable Cloud dashboard.

