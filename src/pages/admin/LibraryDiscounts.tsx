import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Percent, Tag } from "lucide-react";
import { toast } from "sonner";
import type { Library } from "@/lib/types";

interface Discount {
  active: boolean;
  type: "PERCENT" | "FLAT";
  value: number;
  validFrom?: string;
  validTo?: string;
}

export default function LibraryDiscounts() {
  const queryClient = useQueryClient();
  const [editingLib, setEditingLib] = useState<Library | null>(null);
  const [discountForm, setDiscountForm] = useState<Discount>({
    active: false, type: "PERCENT", value: 0,
  });

  const { data: libraries, isLoading } = useQuery<Library[]>({
    queryKey: ["admin-libraries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("libraries").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, discount }: { id: string; discount: Discount }) => {
      const { error } = await supabase
        .from("libraries")
        .update({ discount } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-libraries"] });
      queryClient.invalidateQueries({ queryKey: ["libraries"] });
      toast.success("Discount updated!");
      setEditingLib(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (lib: Library) => {
    const d = (lib as any).discount as Discount | null;
    setDiscountForm(d ?? { active: false, type: "PERCENT", value: 0 });
    setEditingLib(lib);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Library Discounts</h1>
        <p className="text-sm text-muted-foreground">Set discounts per library applied at checkout.</p>
      </div>

      <div className="rounded-lg border">
        <div className="hidden sm:grid grid-cols-5 gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
          <span className="col-span-2">Library</span>
          <span>Discount</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>
        {libraries?.map((lib) => {
          const d = (lib as any).discount as Discount | null;
          return (
            <div key={lib.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 items-center border-b px-4 py-3 last:border-b-0">
              <div className="sm:col-span-2">
                <p className="font-medium text-foreground">{lib.name}</p>
                <p className="text-xs text-muted-foreground">{lib.short_code}</p>
              </div>
              <div className="text-sm text-foreground">
                {d && d.active ? (
                  <span className="inline-flex items-center gap-1">
                    {d.type === "PERCENT" ? <Percent className="h-3.5 w-3.5" /> : <Tag className="h-3.5 w-3.5" />}
                    {d.type === "PERCENT" ? `${d.value}%` : `₹${d.value}`}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <div>
                {d?.active ? (
                  <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Active</span>
                ) : (
                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Inactive</span>
                )}
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm" onClick={() => openEdit(lib)}>Edit</Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLib} onOpenChange={(open) => !open && setEditingLib(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Discount — {editingLib?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={discountForm.active}
                onCheckedChange={(c) => setDiscountForm((p) => ({ ...p, active: c }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={discountForm.type}
                onValueChange={(v) => setDiscountForm((p) => ({ ...p, type: v as "PERCENT" | "FLAT" }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                  <SelectItem value="FLAT">Flat (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                type="number"
                min={0}
                value={discountForm.value}
                onChange={(e) => setDiscountForm((p) => ({ ...p, value: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Valid From (optional)</Label>
              <Input
                type="date"
                value={discountForm.validFrom || ""}
                onChange={(e) => setDiscountForm((p) => ({ ...p, validFrom: e.target.value || undefined }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Valid To (optional)</Label>
              <Input
                type="date"
                value={discountForm.validTo || ""}
                onChange={(e) => setDiscountForm((p) => ({ ...p, validTo: e.target.value || undefined }))}
              />
            </div>
            <Button
              className="w-full"
              disabled={saveMutation.isPending}
              onClick={() => editingLib && saveMutation.mutate({ id: editingLib.id, discount: discountForm })}
            >
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Discount
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
