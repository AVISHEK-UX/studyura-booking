

## Generate Receipt PDF Server-Side

### Overview
Replace the current `window.open` + `document.write` print logic with a backend edge function that generates a real PDF, uploads it to storage, and returns a public URL. This works reliably on Android WebView / Hostinger apps.

### Architecture

```text
User clicks "Print Receipt"
  → Frontend calls edge function `generate-receipt-pdf` with bookingId
  → Edge function:
      1. Fetches booking from DB (using service role)
      2. Builds PDF using pdf-lib (pure JS, works in Deno)
      3. Uploads to storage bucket `receipts/{bookingId}.pdf`
      4. Creates signed URL (24h expiry)
      5. Returns { pdfUrl }
  → Frontend opens pdfUrl in new tab
```

### Changes

**1. Create storage bucket `receipts`** (via migration)
- Public bucket for receipt PDFs

**2. Create edge function `supabase/functions/generate-receipt-pdf/index.ts`**
- Import `pdf-lib` from CDN (`https://esm.sh/pdf-lib`)
- Accept `{ bookingId }` in POST body
- Authenticate the caller (verify JWT, ensure user owns the booking or is admin)
- Query `bookings` table using service role key
- Generate PDF with pdf-lib: header "StudyUra Receipt", booking ID, date, shift, amount, customer details, status
- Upload to `receipts` storage bucket as `{bookingId}.pdf`
- Create a signed URL (24h) via `storage.from('receipts').createSignedUrl()`
- Return `{ pdfUrl }` — a real `https://` URL ending in `.pdf`
- Add CORS headers, OPTIONS handler

**3. Update `supabase/config.toml`** — actually this is auto-managed, so we add `verify_jwt = false` and validate in code.

**4. Update `src/pages/MyBookings.tsx` — BookingCard**
- Replace `handlePrint` with async function that:
  - Calls `supabase.functions.invoke('generate-receipt-pdf', { body: { bookingId: booking.id } })`
  - Shows loading state on button
  - On success, opens `pdfUrl` via `window.open(pdfUrl, '_blank')`
  - Shows toast on error

**5. Update `src/components/public/PaymentForm.tsx` — handlePrint**
- Same approach: call the edge function with booking ID, open returned URL
- Replace the `window.open("")` + `document.write` logic

### Notes
- Using `pdf-lib` (works in Deno, no native deps) instead of jsPDF
- Firebase Storage is not available — we use the existing Lovable Cloud storage instead
- The signed URL is a real HTTPS URL, not blob/data, ensuring Android WebView compatibility

