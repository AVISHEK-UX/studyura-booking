

## Fix: Show User Email, Ensure Booking ID Visibility, Fix RLS

### Issues Identified

1. **RLS policies on bookings are still RESTRICTIVE** -- both "Users can read own bookings" and "Admins can read all bookings" have `Permissive: No`, meaning a user must satisfy BOTH conditions simultaneously (be the owner AND be admin) to see bookings. This is why My Bookings may intermittently fail.
2. **User email is not stored in bookings** -- the `bookings` table has no email column, so it can't be displayed anywhere.
3. **Booking ID generation already works** -- the `verify-razorpay-payment` edge function generates a unique `STU-{CODE}-{YYMMDD}-{RANDOM6}` booking ID on successful payment. This just needs to be visible in both user and admin views.

### Changes

**1. Database Migration**
- Add `customer_email` column (text, nullable) to the `bookings` table
- Drop the two restrictive SELECT policies and recreate them as PERMISSIVE so users can see their own bookings OR admins can see all bookings

**2. `src/components/public/PaymentForm.tsx`**
- Store `user.email` as `customer_email` when inserting the draft booking

**3. `src/components/public/BookingForm.tsx`**
- Store `user.email` as `customer_email` when inserting a booking (WhatsApp-only flow)

**4. `src/pages/MyBookings.tsx`**
- Already shows `user?.email` in the header -- no change needed there
- Booking cards already show `booking_id` -- confirmed working

**5. `src/pages/admin/LibraryBookings.tsx`**
- Add `customer_email` to the Booking type
- Add an "Email" column to the admin bookings table
- Show email in the booking detail drawer

