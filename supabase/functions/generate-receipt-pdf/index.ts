import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch booking with service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: booking, error: bookingError } = await adminClient
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check ownership (user owns booking or is admin)
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (booking.user_id !== userId && !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 560]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const green = rgb(0.176, 0.541, 0.431); // #2d8a6e
    const black = rgb(0.1, 0.1, 0.1);
    const gray = rgb(0.4, 0.4, 0.4);

    let y = 520;
    const drawText = (text: string, x: number, yPos: number, f = font, size = 11, color = black) => {
      page.drawText(text, { x, y: yPos, size, font: f, color });
    };

    // Header
    drawText("StudyUra", 155, y, fontBold, 22, green);
    y -= 22;
    drawText("Payment Receipt", 155, y, font, 12, gray);
    y -= 16;
    page.drawLine({ start: { x: 30, y }, end: { x: 370, y }, thickness: 2, color: green });
    y -= 8;

    // Badge
    drawText("Payment Successful", 145, y, fontBold, 12, green);
    y -= 30;

    // Rows
    const rows: [string, string][] = [];
    if (booking.booking_id) rows.push(["Booking ID", booking.booking_id]);
    const dateStr = new Date(booking.preferred_date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
    rows.push(["Date", dateStr]);
    if (booking.payment_id) rows.push(["Payment ID", booking.payment_id]);
    rows.push(["Customer", booking.customer_name]);
    if (booking.customer_email) rows.push(["Email", booking.customer_email]);
    if (booking.customer_phone) rows.push(["Phone", booking.customer_phone]);
    rows.push(["Library", booking.library_name]);
    rows.push(["Shift", booking.preferred_shift]);
    if (booking.plan) rows.push(["Plan", booking.plan]);
    rows.push(["Status", booking.status]);

    for (const [label, value] of rows) {
      drawText(label, 30, y, font, 10, gray);
      // Truncate long values
      const displayValue = value.length > 35 ? value.substring(0, 35) + "…" : value;
      drawText(displayValue, 160, y, fontBold, 10, black);
      y -= 6;
      page.drawLine({ start: { x: 30, y }, end: { x: 370, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
      y -= 14;
    }

    // Discount row
    if (booking.discount_applied) {
      const d = booking.discount_applied as any;
      const discountLabel = d.label || (d.type === "percent" ? `${d.value}% off` : `₹${d.value} off`);
      drawText("Discount", 30, y, font, 10, rgb(0.75, 0.22, 0.17));
      drawText(discountLabel, 160, y, fontBold, 10, rgb(0.75, 0.22, 0.17));
      y -= 20;
    }

    // Total
    page.drawLine({ start: { x: 30, y }, end: { x: 370, y }, thickness: 2, color: green });
    y -= 20;
    const amount = booking.final_amount ?? booking.amount ?? 0;
    drawText("Amount Paid", 30, y, fontBold, 13, black);
    drawText(`₹${amount}`, 160, y, fontBold, 13, green);
    y -= 40;

    // Footer
    drawText("Thank you for choosing StudyUra!", 110, y, font, 10, gray);
    y -= 14;
    drawText("This is a computer-generated receipt.", 105, y, font, 9, gray);

    const pdfBytes = await pdfDoc.save();
    const fileName = `${bookingId}.pdf`;

    // Upload to storage
    const { error: uploadError } = await adminClient.storage
      .from("receipts")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to upload PDF" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create signed URL (24h)
    const { data: signedUrlData, error: signedUrlError } = await adminClient.storage
      .from("receipts")
      .createSignedUrl(fileName, 86400);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);
      return new Response(JSON.stringify({ error: "Failed to create URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ pdfUrl: signedUrlData.signedUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
