import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/public/Header";
import BottomNav from "@/components/public/BottomNav";
import { Button } from "@/components/ui/button";
import { Loader2, IndianRupee, Calendar, Clock, BookOpen, LogOut, Printer } from "lucide-react";
import { toast } from "sonner";
import { openExternalUrl } from "@/lib/capacitor-utils";

export default function MyBookings() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const today = new Date().toISOString().split("T")[0];

  const currentBookings = bookings?.filter((b) => b.preferred_date >= today) ?? [];
  const pastBookings = bookings?.filter((b) => b.preferred_date < today) ?? [];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">My Bookings</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings?.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">No bookings yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse libraries and book your first seat!
            </p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Browse Libraries
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {currentBookings.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Current & Upcoming
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {currentBookings.map((b) => (
                    <BookingCard key={b.id} booking={b} isCurrent />
                  ))}
                </div>
              </section>
            )}

            {pastBookings.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Past Bookings
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pastBookings.map((b) => (
                    <BookingCard key={b.id} booking={b} isCurrent={false} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, isCurrent }: { booking: any; isCurrent: boolean }) {
  const [printing, setPrinting] = useState(false);
  const isMobile = useIsMobile();

  const handlePrintDesktop = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const amount = booking.final_amount ?? booking.amount ?? 0;
    const dateStr = new Date(booking.preferred_date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
    w.document.write(`<html><head><title>Receipt</title><style>body{font-family:sans-serif;padding:40px;max-width:500px;margin:auto}h1{color:#2d8a6e}table{width:100%;border-collapse:collapse;margin:20px 0}td{padding:8px 4px;border-bottom:1px solid #eee}td:first-child{color:#888;width:40%}.total{font-size:1.2em;font-weight:bold;color:#2d8a6e}</style></head><body><h1>StudyUra</h1><p>Payment Receipt</p><table>`);
    if (booking.booking_id) w.document.write(`<tr><td>Booking ID</td><td>${booking.booking_id}</td></tr>`);
    w.document.write(`<tr><td>Date</td><td>${dateStr}</td></tr>`);
    if (booking.payment_id) w.document.write(`<tr><td>Payment ID</td><td>${booking.payment_id}</td></tr>`);
    w.document.write(`<tr><td>Customer</td><td>${booking.customer_name}</td></tr>`);
    if (booking.customer_email) w.document.write(`<tr><td>Email</td><td>${booking.customer_email}</td></tr>`);
    if (booking.customer_phone) w.document.write(`<tr><td>Phone</td><td>${booking.customer_phone}</td></tr>`);
    w.document.write(`<tr><td>Library</td><td>${booking.library_name}</td></tr>`);
    w.document.write(`<tr><td>Shift</td><td>${booking.preferred_shift}</td></tr>`);
    if (booking.plan) w.document.write(`<tr><td>Plan</td><td>${booking.plan}</td></tr>`);
    w.document.write(`<tr><td>Status</td><td>${booking.status}</td></tr>`);
    w.document.write(`</table><p class="total">Amount Paid: ₹${amount}</p><p style="color:#888;font-size:12px">Thank you for choosing StudyUra!</p></body></html>`);
    w.document.close();
    w.print();
  };

  const handlePrintMobile = async () => {
    setPrinting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-receipt-pdf", {
        body: { bookingId: booking.id },
      });
      if (error || !data?.pdfUrl) {
        throw new Error(error?.message || "Failed to generate receipt");
      }
      await openExternalUrl(data.pdfUrl);
    } catch (err: any) {
      toast.error(err.message || "Could not generate receipt");
    } finally {
      setPrinting(false);
    }
  };

  const handlePrint = () => {
    if (isMobile) {
      handlePrintMobile();
    } else {
      handlePrintDesktop();
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 ${
        isCurrent ? "border-primary/30 bg-primary/5" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-display font-semibold text-foreground">{booking.library_name}</h3>
        {isCurrent && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Active
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5 text-sm">
        {booking.booking_id && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="font-mono">{booking.booking_id}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(booking.preferred_date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {booking.preferred_shift}
        </div>
        {(booking as any).amount && (
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <IndianRupee className="h-3.5 w-3.5" />
            {(booking as any).amount}
            {(booking as any).plan && (
              <span className="ml-1 text-xs font-normal capitalize text-muted-foreground">
                ({(booking as any).plan})
              </span>
            )}
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        disabled={printing}
        className="mt-3 w-full gap-2 text-xs"
      >
        {printing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
        {printing ? "Generating…" : "Print Receipt"}
      </Button>
    </div>
  );
}
