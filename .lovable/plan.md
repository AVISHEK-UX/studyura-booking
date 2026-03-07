

## Update Razorpay to Live Keys

### What needs to happen

Two secrets need to be updated with your live Razorpay credentials:

1. **RAZORPAY_KEY_ID** → `rzp_live_SOGgBphfDzQhBt`
2. **RAZORPAY_KEY_SECRET** → `aKInYCivSLncIOV7tHTHPbVX`

These secrets already exist in the backend — they just need to be replaced with the live values.

### No code changes needed

The edge functions (`create-razorpay-order` and `verify-razorpay-payment`) already read these secrets dynamically via `Deno.env.get()`, so no code changes are required. Once the secrets are updated, all payments will automatically go through Razorpay's live environment.

### Security note

**Please avoid sharing API keys in chat.** In future, when prompted to add a secret, paste the value directly into the secure input field provided.

