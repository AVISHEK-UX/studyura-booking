import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { library_name, customer_name, customer_phone, preferred_date, preferred_shift } =
      await req.json();

    // Fetch admin WhatsApp config
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: config, error } = await supabase
      .from("app_config")
      .select("whatsapp_number, whatsapp_template")
      .eq("id", "main")
      .single();

    if (error || !config?.whatsapp_number) {
      return new Response(JSON.stringify({ error: "WhatsApp not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build message
    const message = config.whatsapp_template
      .replace("{name}", customer_name)
      .replace("{library}", library_name)
      .replace("{date}", preferred_date)
      .replace("{shift}", preferred_shift);

    const fullMessage = customer_phone
      ? `${message}\nPhone: ${customer_phone}`
      : message;

    // Use WhatsApp Cloud API via Twilio or direct wa.me isn't possible server-side
    // For now, we use the CallMeBot free WhatsApp API as a simple notification
    // The admin can later upgrade to Twilio for production use
    const whatsappNumber = config.whatsapp_number;
    const apiKey = Deno.env.get("CALLMEBOT_API_KEY");

    if (apiKey) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${whatsappNumber}&text=${encodeURIComponent(fullMessage)}&apikey=${apiKey}`;
      await fetch(url);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
