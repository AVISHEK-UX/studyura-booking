

## Add Razorpay Payment Method Configuration

### Change

**`src/components/public/PaymentForm.tsx`** — Add a `method` object to the Razorpay checkout options (around line 312, after the `theme` property):

```ts
method: {
  upi: true,
  card: true,
  netbanking: false,
  wallet: false,
  emi: false,
  paylater: false,
},
```

This restricts the Razorpay checkout modal to only show UPI and Card payment options, hiding netbanking, wallets, EMI, and pay-later.

| File | Line | Change |
|------|------|--------|
| `src/components/public/PaymentForm.tsx` | ~312 | Add `method` config after `theme` |

