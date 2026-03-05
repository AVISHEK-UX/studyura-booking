

## Replace Lovable Branding with StudyUra + Update Logo

### Summary
The codebase already uses "StudyUra" branding almost everywhere. The only Lovable reference visible to users is in the HTML meta tag. The user also uploaded a new logo to replace the current one.

### Changes

**Copy new logo asset**
- Copy `user-uploads://logo-3.png` to `src/assets/logo-3.png`

**`index.html`**
- Change `twitter:site` from `@Lovable` to `@StudyUra`

**`src/assets/logo.png`** (optional)
- Replace the current logo with the new uploaded logo so all existing imports (`logo.png`) automatically use it — OR keep both and update imports

**Recommended approach**: Replace `src/assets/logo.png` with the new uploaded logo so the Header, SplashScreen, and admin Login all pick it up automatically without code changes.

### Files to Change
| File | Change |
|------|--------|
| `src/assets/logo.png` | Replace with new uploaded logo |
| `index.html` | Change `@Lovable` → `@StudyUra` in twitter:site meta |

### Note
Files like `src/integrations/lovable/index.ts` and `vite.config.ts` are auto-generated system files and cannot/should not be modified — they don't show any branding to users.

