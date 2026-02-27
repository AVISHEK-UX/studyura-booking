import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppConfig } from "@/hooks/useLibraries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminSettings() {
  const { data: config } = useAppConfig();
  const queryClient = useQueryClient();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");

  useEffect(() => {
    if (config) {
      setWhatsappNumber(config.whatsapp_number);
      setWhatsappTemplate(config.whatsapp_template);
    }
  }, [config]);

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("app_config")
        .update({
          whatsapp_number: whatsappNumber,
          whatsapp_template: whatsappTemplate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app_config"] });
      toast.success("Settings saved!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-foreground">WhatsApp Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure the WhatsApp number and message template for booking enquiries.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-6 space-y-5">
        <div>
          <Label>WhatsApp Number (with country code)</Label>
          <Input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="919876543210"
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Enter without + or spaces. E.g. 919876543210
          </p>
        </div>

        <div>
          <Label>Message Template</Label>
          <Textarea
            value={whatsappTemplate}
            onChange={(e) => setWhatsappTemplate(e.target.value)}
            rows={4}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Placeholders: {"{name}"}, {"{library}"}, {"{date}"}, {"{shift}"}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground">Preview</p>
          <p className="mt-1 text-sm text-foreground">
            {whatsappTemplate
              .replace("{name}", "John")
              .replace("{library}", "Wisdom Library")
              .replace("{date}", "2026-03-01")
              .replace("{shift}", "Morning 6AM-12PM")}
          </p>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
