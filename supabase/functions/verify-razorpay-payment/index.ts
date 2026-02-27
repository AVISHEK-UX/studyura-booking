import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function generateBookingId(shortCode: string): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rnd = '';
  for (let i = 0; i < 6; i++) {
    rnd += chars[Math.floor(Math.random() * chars.length)];
  }
  const code = shortCode || 'GEN';
  return `STU-${code}-${yy}${mm}${dd}-${rnd}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay secret not configured');
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_row_id,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_row_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature
    const expectedSig = createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed — invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Signature valid — update booking
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch the booking to get library info for booking ID
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('library_id')
      .eq('id', booking_row_id)
      .single();

    if (fetchErr) throw new Error(`Booking not found: ${fetchErr.message}`);

    // Get library short_code
    let shortCode = 'GEN';
    if (booking.library_id) {
      const { data: lib } = await supabase
        .from('libraries')
        .select('short_code')
        .eq('id', booking.library_id)
        .single();
      if (lib?.short_code) shortCode = lib.short_code;
    }

    const bookingId = generateBookingId(shortCode);

    const { error: updateErr } = await supabase
      .from('bookings')
      .update({
        status: 'PAID',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        booking_id: bookingId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', booking_row_id);

    if (updateErr) throw new Error(`Failed to update booking: ${updateErr.message}`);

    return new Response(
      JSON.stringify({ success: true, booking_id: bookingId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Verification error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
