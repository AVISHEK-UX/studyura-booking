import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCallback } from "react";

export function useFavourites() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: favourites = [] } = useQuery({
    queryKey: ["favourites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favourites")
        .select("library_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((f) => f.library_id);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (libraryId: string) => {
      if (!user) throw new Error("Not authenticated");
      const isFav = favourites.includes(libraryId);
      if (isFav) {
        const { error } = await supabase
          .from("favourites")
          .delete()
          .eq("user_id", user.id)
          .eq("library_id", libraryId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favourites")
          .insert({ user_id: user.id, library_id: libraryId });
        if (error) throw error;
      }
    },
    onMutate: async (libraryId: string) => {
      await qc.cancelQueries({ queryKey: ["favourites", user?.id] });
      const prev = qc.getQueryData<string[]>(["favourites", user?.id]) ?? [];
      const next = prev.includes(libraryId)
        ? prev.filter((id) => id !== libraryId)
        : [...prev, libraryId];
      qc.setQueryData(["favourites", user?.id], next);
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        qc.setQueryData(["favourites", user?.id], context.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["favourites", user?.id] });
    },
  });

  const isFavourite = useCallback(
    (libraryId: string) => favourites.includes(libraryId),
    [favourites]
  );

  const toggleFavourite = useCallback(
    (libraryId: string) => toggleMutation.mutate(libraryId),
    [toggleMutation]
  );

  return { favourites, isFavourite, toggleFavourite };
}
