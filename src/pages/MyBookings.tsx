import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import { Loader2, IndianRupee, Calendar, Clock, BookOpen, LogOut, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-receipt-pdf", {
        body: { bookingId: booking.id },
      });
      if (error || !data?.pdfUrl) {
        throw new Error(error?.message || "Failed to generate receipt");
      }
      window.open(data.pdfUrl, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Could not generate receipt");
    } finally {
      setPrinting(false);
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
        className="mt-3 w-full gap-2 text-xs"
      >
        <Printer className="h-3.5 w-3.5" />
        Print Receipt
      </Button>
    </div>
  );
}
