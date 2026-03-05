

## Add Privacy Policy Page and Footer Link

### Changes

1. **Create `/src/pages/PrivacyPolicy.tsx`** — A concise privacy policy page for StudyUra covering data collection, usage, cookies, third-party services (Razorpay), contact info, and user rights. Keep it short and professional.

2. **Update `src/App.tsx`** — Add route: `<Route path="/privacy-policy" element={<PrivacyPolicy />} />`

3. **Update `src/pages/Index.tsx`** (line ~253) — Add a "Privacy Policy" link in the footer that opens in a new tab using `<a href="/privacy-policy" target="_blank">`.

