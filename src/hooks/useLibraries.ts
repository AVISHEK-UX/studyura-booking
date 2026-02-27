import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Library, AppConfig } from "@/lib/types";

export function useLibraries() {
  return useQuery<Library[]>({
    queryKey: ["libraries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("libraries")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useLibrary(id: string) {
  return useQuery<Library | null>({
    queryKey: ["library", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("libraries")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useAppConfig() {
  return useQuery<AppConfig>({
    queryKey: ["app_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_config")
        .select("*")
        .eq("id", "main")
        .single();
      if (error) throw error;
      return data;
    },
  });
}
