
## Fix WhatsApp Redirect & Print Receipt in Android APK (Capacitor WebView)

### Problem Analysis
The screenshot shows `net::ERR_UNKNOWN_URL_SCHEME` for `whatsapp://send/` URL. This happens because:

1. **WhatsApp deep links (`https://wa.me/...`) don't work inside Android WebView** - The Capacitor app's WebView cannot open external app schemes directly
2. **Print receipt also fails** - The `window.open()` for PDF URLs may be blocked in native WebView

### Root Cause
- Capacitor WebView doesn't handle external app intent URLs (`whatsapp://`, `https://wa.me/`) automatically
- Need to use Capacitor's App Linking plugin to open external URLs properly

### Solution

**1. Install Capacitor App plugin** (handles external URL intents)
- Add `@capacitor/app` dependency

**2. Create a utility function `openExternalUrl()`**
- Detect if running in Capacitor (native) using `Capacitor.isNativePlatform()`
- If native: Use `@capacitor/browser` or `@capacitor/app-launcher` to open URLs
- If web: Use regular `window.open()`

**3. Update `PaymentForm.tsx`**
- Replace `window.open(receipt.whatsappUrl, "_blank")` with the new utility
- Replace `window.open(data.pdfUrl, "_blank")` with the new utility

**4. Update `MyBookings.tsx`**
- Replace `window.open(data.pdfUrl, "_blank")` with the new utility

**5. Update `Header.tsx`**
- Replace WhatsApp `<a href>` with click handler using the new utility

### Files to Modify
- `package.json` - Add `@capacitor/browser` dependency
- `src/lib/capacitor-utils.ts` - New file for external URL handling
- `src/components/public/PaymentForm.tsx` - Use new utility
- `src/pages/MyBookings.tsx` - Use new utility
- `src/components/public/Header.tsx` - Use new utility

### Technical Details
```typescript
// src/lib/capacitor-utils.ts
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export async function openExternalUrl(url: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  } else {
    window.open(url, '_blank');
  }
}
```

This approach uses Capacitor's Browser plugin which handles WhatsApp links correctly on Android by opening the system browser/intent handler.
