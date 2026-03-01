

## Replace "Continue to WhatsApp" with Slide-to-Confirm Button

### What Changes

The "Continue to WhatsApp" button in the payment receipt view will be replaced with a slide-to-confirm button labeled "Confirm Your Booking". When the user slides to confirm, it will open WhatsApp automatically upon success.

### Steps

**1. Install framer-motion dependency**
- Required by the SlideButton component for drag animations

**2. Create `src/components/ui/slide-button.tsx`**
- Copy the provided SlideButton component code
- Adapt it to accept an `onConfirm` callback prop (instead of the hardcoded timeout/status logic)
- Change the drag handle icon text/label to show "Confirm Your Booking"
- On successful slide completion, call the `onConfirm` callback which will open WhatsApp

**3. Update `src/components/public/PaymentForm.tsx`**
- Replace the "Continue to WhatsApp" `<Button>` block (lines 445-452) with the new SlideButton
- Pass the WhatsApp URL opening logic as the `onConfirm` prop
- Keep the "Copy Message" and "Print Receipt" buttons unchanged below it

### Technical Details

| File | Change |
|------|--------|
| `package.json` | Add `framer-motion` dependency |
| `src/components/ui/slide-button.tsx` | New component -- adapted SlideButton with `onConfirm` prop |
| `src/components/public/PaymentForm.tsx` | Replace WhatsApp button with SlideButton, label "Confirm Your Booking" |

