import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SlideButton } from "@/components/ui/slide-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Loader2, IndianRupee, Printer, MessageCircle, Copy, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  shift: z.string().min(1, "Shift is required"),
  plan: z.string().min(1, "Plan is required"),
});

type FormData = z.infer<typeof schema>;

interface Discount {
  active: boolean;
  type: "PERCENT" | "FLAT";
  value: number;
  validFrom?: string;
  validTo?: string;
}

interface PaymentFormProps {
  libraryId: string;
  libraryName: string;
  libraryWhatsapp: string;
  shifts: string[];
  pricing: Record<string, number>;
  discount?: Discount | null;
}

interface ReceiptData {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  library: string;
  shift: string;
  plan: string;
  baseAmount: number;
  discountLabel: string;
  finalAmount: number;
  paymentId: string;
  date: string;
  whatsappUrl: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function isDiscountActive(d?: Discount | null): boolean {
  if (!d || !d.active) return false;
  const now = new Date();
  if (d.validFrom && new Date(d.validFrom) > now) return false;
  if (d.validTo && new Date(d.validTo) < now) return false;
  return true;
}

function calcDiscount(baseAmount: number, d: Discount): { finalAmount: number; amountOff: number; label: string } {
  let amountOff = 0;
  let label = "";
  if (d.type === "PERCENT") {
    amountOff = Math.round(baseAmount * d.value / 100);
    label = `${d.value}% off`;
  } else {
    amountOff = Math.min(d.value, baseAmount);
    label = `₹${d.value} off`;
  }
  return { finalAmount: Math.max(baseAmount - amountOff, 0), amountOff, label };
}

function buildWhatsAppMessage(data: {
  bookingId: string; libraryName: string; bookingDate: string;
  shift: string; userName: string; userPhone: string; amount: number; paymentId: string;
}) {
  return `Hello, I have booked a seat on StudyUra.

Booking ID: ${data.bookingId}
Library: ${data.libraryName}
Date: ${data.bookingDate}
Shift: ${data.shift}
Name: ${data.userName}
Phone: ${data.userPhone}
Amount Paid: ₹${data.amount}
Payment ID: ${data.paymentId}

Please confirm my booking.`;
}

function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function PaymentForm({ libraryId, libraryName, libraryWhatsapp, shifts, pricing, discount }: PaymentFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register, handleSubmit, setValue, watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [selectedShift, setSelectedShift] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);

  // Auto-fill name & phone from last booking or user metadata
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("customer_name, customer_phone")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        if (data.customer_name) setValue("name", data.customer_name);
        if (data.customer_phone) setValue("phone", data.customer_phone);
      } else {
        const fullName = user.user_metadata?.full_name;
        if (fullName) setValue("name", fullName);
      }
    })();
  }, [user, setValue]);

  const currentPlan = watch("plan");
  const pricingEntries = Object.entries(pricing);
  const baseAmount = currentPlan && pricing[currentPlan] !== undefined ? pricing[currentPlan] : 0;

  const discountActive = isDiscountActive(discount);
  const discountInfo = discountActive && baseAmount > 0 ? calcDiscount(baseAmount, discount!) : null;
  const finalAmount = discountInfo ? discountInfo.finalAmount : baseAmount;

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <LogIn className="h-10 w-10 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Log in to Book</h3>
        <p className="text-sm text-muted-foreground">
          Please log in to book this library.
        </p>
        <Button
          className="w-full gap-2"
          onClick={() => navigate(`/login?redirect=/library/${libraryId}`)}
        >
          <LogIn className="h-4 w-4" />
          Log In to Continue
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    if (!receiptRef.current || !receipt) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Payment Receipt — ${libraryName}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 40px auto; padding: 24px; color: #1a1a1a; }
        .header { text-align: center; border-bottom: 2px solid #2d8a6e; padding-bottom: 16px; margin-bottom: 20px; }
        .header h1 { font-size: 22px; margin: 0 0 4px; color: #2d8a6e; }
        .header p { margin: 0; font-size: 13px; color: #666; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .row .label { color: #666; } .row .value { font-weight: 600; }
        .total { font-size: 18px; border-top: 2px solid #2d8a6e; margin-top: 12px; padding-top: 12px; }
        .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #999; }
        .badge { display: inline-block; background: #e6f7f0; color: #2d8a6e; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 8px; }
        .discount { color: #c0392b; font-size: 13px; }
      </style></head><body>
        <div class="header"><h1>StudyUra</h1><p>Payment Receipt</p><span class="badge">✓ Payment Successful</span></div>
        <div class="row"><span class="label">Booking ID</span><span class="value">${receipt.bookingId}</span></div>
        <div class="row"><span class="label">Receipt Date</span><span class="value">${receipt.date}</span></div>
        <div class="row"><span class="label">Payment ID</span><span class="value">${receipt.paymentId}</span></div>
        <div class="row"><span class="label">Customer</span><span class="value">${receipt.name}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${receipt.email}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${receipt.phone}</span></div>
        <div class="row"><span class="label">Library</span><span class="value">${receipt.library}</span></div>
        <div class="row"><span class="label">Shift</span><span class="value">${receipt.shift}</span></div>
        <div class="row"><span class="label">Plan</span><span class="value">${receipt.plan}</span></div>
        ${receipt.discountLabel ? `<div class="row discount"><span class="label">Discount</span><span class="value">${receipt.discountLabel}</span></div>` : ""}
        <div class="row total"><span class="label">Amount Paid</span><span class="value">₹${receipt.finalAmount}</span></div>
        <div class="footer">Thank you for choosing StudyUra!<br/>This is a computer-generated receipt.</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopyMessage = () => {
    if (!receipt) return;
    const msg = buildWhatsAppMessage({
      bookingId: receipt.bookingId, libraryName: receipt.library,
      bookingDate: receipt.date, shift: receipt.shift,
      userName: receipt.name, userPhone: receipt.phone,
      amount: receipt.finalAmount, paymentId: receipt.paymentId,
    });
    navigator.clipboard.writeText(msg);
    toast.success("Message copied to clipboard!");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setPaymentError("");

    try {
      const base = pricing[data.plan];
      if (!base || base <= 0) {
        setPaymentError("No pricing available for this plan.");
        setIsSubmitting(false);
        return;
      }

      const disc = isDiscountActive(discount) ? calcDiscount(base, discount!) : null;
      const payableAmount = disc ? disc.finalAmount : base;

      if (payableAmount <= 0) {
        setPaymentError("Invalid final amount.");
        setIsSubmitting(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPaymentError("Failed to load payment gateway. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Step 1: Create draft booking (PENDING_PAYMENT)
      const draftId = crypto.randomUUID();
      const discountApplied = disc ? { type: discount!.type, value: discount!.value, amount_off: disc.amountOff } : null;

      const { error: draftErr } = await supabase.from("bookings").insert({
        id: draftId,
        library_name: libraryName,
        library_id: libraryId,
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: user.email || null,
        preferred_date: new Date().toISOString().split("T")[0],
        preferred_shift: data.shift,
        user_id: user.id,
        amount: payableAmount,
        base_amount: base,
        discount_applied: discountApplied,
        final_amount: payableAmount,
        plan: data.plan,
        status: "PENDING_PAYMENT",
      });

      if (draftErr) throw new Error(draftErr.message || "Failed to create booking draft");

      // Step 2: Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: payableAmount, currency: "INR",
            receipt: `booking_${draftId}`,
            notes: { library: libraryName, shift: data.shift, plan: data.plan, customer_name: data.name },
          },
        }
      );

      if (orderError || !orderData?.order_id) {
        await supabase.from("bookings").update({ status: "CANCELLED" }).eq("id", draftId);
        throw new Error(orderError?.message || "Failed to create payment order");
      }

      // Step 3: Open Razorpay checkout
      const userEmail = user.email || "";
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StudyUra",
        description: `${libraryName} — ${data.shift} (${data.plan})`,
        order_id: orderData.order_id,
        prefill: { name: data.name, email: userEmail, contact: data.phone },
        notes: { library: libraryName, shift: data.shift, plan: data.plan },
        theme: { color: "#2d8a6e" },
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyErr } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_row_id: draftId,
                },
              }
            );

            if (verifyErr || !verifyData?.booking_id) {
              setPaymentError("Payment received but verification failed. Contact support.");
              setIsSubmitting(false);
              return;
            }

            const bookingId = verifyData.booking_id;
            const todayStr = new Date().toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
            });

            const whatsappMsg = buildWhatsAppMessage({
              bookingId, libraryName, bookingDate: todayStr,
              shift: data.shift, userName: data.name, userPhone: data.phone,
              amount: payableAmount, paymentId: response.razorpay_payment_id || "N/A",
            });

            const whatsappUrl = libraryWhatsapp
              ? buildWhatsAppUrl(libraryWhatsapp, whatsappMsg)
              : "";

            setReceipt({
              bookingId, name: data.name, email: userEmail, phone: data.phone,
              library: libraryName, shift: data.shift, plan: data.plan,
              baseAmount: base, discountLabel: disc ? disc.label : "",
              finalAmount: payableAmount,
              paymentId: response.razorpay_payment_id || "N/A", date: todayStr,
              whatsappUrl,
            });

            if (whatsappUrl) {
              setTimeout(() => window.open(whatsappUrl, "_blank"), 2000);
            }
          } catch (e) {
            console.error("Verification error:", e);
            setPaymentError("Payment received but verification failed. Contact support.");
          }
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            supabase.from("bookings").update({ status: "CANCELLED" }).eq("id", draftId);
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async (response: any) => {
        await supabase.from("bookings").update({ status: "CANCELLED" }).eq("id", draftId);
        setPaymentError(response.error?.description || "Payment failed. Please try again.");
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Receipt view
  if (receipt) {
    return (
      <div ref={receiptRef} className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h3 className="font-display text-xl font-bold text-foreground">Payment Successful!</h3>
          <p className="text-xs text-muted-foreground">Redirecting to WhatsApp…</p>
        </div>

        <div className="space-y-2 rounded-lg border bg-secondary/30 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono text-xs font-bold text-primary">{receipt.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment ID</span>
            <span className="font-mono text-xs font-medium text-foreground">{receipt.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium text-foreground">{receipt.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Library</span>
            <span className="font-medium text-foreground">{receipt.library}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shift</span>
            <span className="font-medium text-foreground">{receipt.shift}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium capitalize text-foreground">{receipt.plan}</span>
          </div>
          {receipt.discountLabel && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Amount</span>
                <div className="flex items-center gap-0.5 font-medium text-foreground">
                  <IndianRupee className="h-3.5 w-3.5" />{receipt.baseAmount}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-primary">{receipt.discountLabel}</span>
              </div>
            </>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold text-foreground">Amount Paid</span>
            <div className="flex items-center gap-0.5 text-lg font-bold text-primary">
              <IndianRupee className="h-4 w-4" />{receipt.finalAmount}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {receipt.whatsappUrl && (
            <SlideButton
              onConfirm={() => window.open(receipt.whatsappUrl, "_blank")}
              label="Confirm Your Booking"
            />
          )}
          <Button onClick={handleCopyMessage} variant="outline" className="w-full gap-2">
            <Copy className="h-4 w-4" />
            Copy Message
          </Button>
          <Button onClick={handlePrint} variant="outline" className="w-full gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name *</Label>
        <Input id="name" {...register("name")} placeholder="Enter your name" className="mt-1" />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input id="phone" {...register("phone")} placeholder="Your phone number" className="mt-1" />
        {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div>
        <Label>Select Shift *</Label>
        <Select value={selectedShift} onValueChange={(v) => { setSelectedShift(v); setValue("shift", v, { shouldValidate: true }); }}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a shift" /></SelectTrigger>
          <SelectContent>
            {shifts.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
          </SelectContent>
        </Select>
        {errors.shift && <p className="mt-1 text-sm text-destructive">{errors.shift.message}</p>}
      </div>

      {pricingEntries.length > 0 && (
        <div>
          <Label>Select Plan *</Label>
          <Select value={selectedPlan} onValueChange={(v) => { setSelectedPlan(v); setValue("plan", v, { shouldValidate: true }); }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a plan" /></SelectTrigger>
            <SelectContent>
              {pricingEntries.map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <span className="capitalize">{key}</span> — ₹{value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.plan && <p className="mt-1 text-sm text-destructive">{errors.plan.message}</p>}
        </div>
      )}

      {baseAmount > 0 && (
        <div className="space-y-2 rounded-lg border bg-secondary/50 p-3">
          {discountInfo ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base Price</span>
                <span className="text-foreground line-through">₹{baseAmount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-primary">{discountInfo.label} (−₹{discountInfo.amountOff})</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium text-foreground">Amount to Pay</span>
                <div className="flex items-center gap-0.5 text-lg font-bold text-foreground">
                  <IndianRupee className="h-4 w-4" />{finalAmount}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Amount to Pay</span>
              <div className="flex items-center gap-0.5 text-lg font-bold text-foreground">
                <IndianRupee className="h-4 w-4" />{baseAmount}
              </div>
            </div>
          )}
        </div>
      )}

      {paymentError && <p className="text-sm text-destructive">{paymentError}</p>}

      <Button type="submit" className="w-full gap-2" disabled={isSubmitting || finalAmount <= 0}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {finalAmount > 0 ? `Pay ₹${finalAmount}` : "Select shift & plan"}
      </Button>
    </form>
  );
}
