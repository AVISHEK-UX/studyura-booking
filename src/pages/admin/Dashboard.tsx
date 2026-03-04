import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Library } from "@/lib/types";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: libraries, isLoading } = useQuery<Library[]>({
    queryKey: ["admin-libraries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("libraries")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("libraries").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-libraries"] });
      toast.success("Status updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("libraries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-libraries"] });
      toast.success("Library deleted");
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Libraries</h1>
          <p className="text-sm text-muted-foreground">{libraries?.length ?? 0} total</p>
        </div>
        <Button asChild className="gap-2 w-full sm:w-auto">
          <Link to="/admin/library/new">
            <Plus className="h-4 w-4" />
            Add Library
          </Link>
        </Button>
      </div>

      {/* Mobile card view */}
      <div className="mt-4 space-y-3 md:hidden">
        {isLoading ? (
          <p className="text-center py-8 text-muted-foreground">Loading...</p>
        ) : !libraries?.length ? (
          <p className="text-center py-8 text-muted-foreground">No libraries yet. Add your first one!</p>
        ) : (
          libraries.map((lib) => (
            <div key={lib.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{lib.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{lib.address}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link to={`/admin/library/${lib.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{lib.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(lib.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Order: {lib.sort_order}</span>
                  {(lib as any).seats_left != null && (
                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">{(lib as any).seats_left} seats</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{lib.is_active ? "Active" : "Inactive"}</span>
                  <Switch
                    checked={lib.is_active}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({ id: lib.id, is_active: checked })
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table view */}
      <div className="mt-6 rounded-lg border bg-card hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Seats Left</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : !libraries?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No libraries yet. Add your first one!</TableCell>
              </TableRow>
            ) : (
              libraries.map((lib) => (
                <TableRow key={lib.id}>
                  <TableCell className="font-medium">{lib.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{lib.address}</TableCell>
                  <TableCell>{lib.sort_order}</TableCell>
                  <TableCell>
                    {(lib as any).seats_left != null ? (
                      <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">{(lib as any).seats_left}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={lib.is_active}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: lib.id, is_active: checked })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/library/${lib.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{lib.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(lib.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
