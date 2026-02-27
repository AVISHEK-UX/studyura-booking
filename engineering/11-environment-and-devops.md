# 11 - Environment & DevOps

## Environments

| Environment | Purpose | URL |
|------------|---------|-----|
| Preview | Development & testing | `*.lovable.app` (auto-generated) |
| Production | Live user-facing app | Custom domain or Lovable published URL |

## Hosting
- **Platform:** Lovable (auto-deploy on save)
- **CDN:** Automatic via Lovable hosting
- **SSL:** Automatic HTTPS

## Backend Infrastructure (Lovable Cloud)

| Service | Usage |
|---------|-------|
| PostgreSQL | Primary database (libraries, config) |
| Auth | Admin authentication (email/password) |
| Storage | Library photo uploads |
| RLS | Row-level security policies |

## Environment Variables / Secrets

| Variable | Description | Storage |
|----------|-------------|---------|
| `SUPABASE_URL` | Auto-configured by Lovable Cloud | Built-in |
| `SUPABASE_ANON_KEY` | Auto-configured by Lovable Cloud | Built-in |

No additional secrets required for MVP.

## CI/CD Pipeline
Lovable handles deployment automatically:
1. Code changes saved in editor
2. Preview updates in real-time
3. Publish to production via "Publish" button

## Monitoring & Logging
- **Console logs:** Available in Lovable preview
- **Network requests:** Inspectable in Lovable preview
- **Database:** Manageable via Lovable Cloud tab
- **Future:** Add external analytics (Google Analytics, Plausible)

## Backup & Recovery
- **Database:** Lovable Cloud managed backups
- **Code:** Git-based version control via Lovable
- **Storage:** Lovable Cloud managed

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Image load (lazy) | On viewport entry |
