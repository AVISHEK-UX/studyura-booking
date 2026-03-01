import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAppConfig } from "@/hooks/useLibraries";
import { buildWhatsAppUrl } from "@/lib/types";
import { CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().max(15).optional(),
  date: z.string().min(1, "Date is required"),
  shift: z.string().min(1, "Shift is required"),
});

type FormData = z.infer<typeof schema>;

interface BookingFormProps {
  libraryName: string;
  shifts: string[];
}

export default function BookingForm({ libraryName, shifts }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { user } = useAuth();
  const { data: appConfig } = useAppConfig();
  const [selectedShift, setSelectedShift] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save booking to database
      const { error } = await supabase.from("bookings").insert({
        library_name: libraryName,
        customer_name: data.name,
        customer_phone: data.phone || null,
        preferred_date: data.date,
        preferred_shift: data.shift,
        user_id: user?.id ?? null,
      });

      if (error) throw error;

      // Show confirmation and redirect to WhatsApp
      setIsConfirmed(true);

      if (appConfig) {
        const url = buildWhatsAppUrl(appConfig, {
          name: data.name,
          library: libraryName,
          date: data.date,
          shift: data.shift,
        });
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Booking Confirmed!</h3>
        <p className="text-sm text-muted-foreground">
          Your seat has been booked successfully. We'll get back to you shortly.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name *</Label>
        <Input id="name" {...register("name")} placeholder="Enter your name" className="mt-1" />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" {...register("phone")} placeholder="Your phone number" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="date">Preferred Date *</Label>
        <Input id="date" type="date" min={today} {...register("date")} className="mt-1" />
        {errors.date && <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <div>
        <Label>Preferred Shift *</Label>
        <Select
          value={selectedShift}
          onValueChange={(v) => {
            setSelectedShift(v);
            setValue("shift", v);
          }}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a shift" />
          </SelectTrigger>
          <SelectContent>
            {shifts.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.shift && <p className="mt-1 text-sm text-destructive">{errors.shift.message}</p>}
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Book Your Seat
      </Button>
    </form>
  );
}
