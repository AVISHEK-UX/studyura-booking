import { Tables } from "@/integrations/supabase/types";

export type Library = Tables<"libraries">;
export type AppConfig = Tables<"app_config">;

export interface BookingParams {
  name: string;
  phone?: string;
  library: string;
  date: string;
  shift: string;
}

export function buildWhatsAppUrl(config: AppConfig, params: BookingParams): string {
  const message = config.whatsapp_template
    .replace("{name}", params.name)
    .replace("{library}", params.library)
    .replace("{date}", params.date)
    .replace("{shift}", params.shift);

  return `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(message)}`;
}
