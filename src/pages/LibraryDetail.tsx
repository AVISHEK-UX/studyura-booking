import { useParams, Link } from "react-router-dom";
import { useLibrary } from "@/hooks/useLibraries";
import Header from "@/components/public/Header";
import PhotoCarousel from "@/components/public/PhotoCarousel";
import PaymentForm from "@/components/public/PaymentForm";
import { ArrowLeft, MapPin, Navigation, IndianRupee, Clock, Wifi, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Discount {
  active: boolean;
  type: "PERCENT" | "FLAT";
  value: number;
  validFrom?: string;
  validTo?: string;
}

function isDiscountActive(d?: Discount | null): boolean {
  if (!d || !d.active) return false;
  const now = new Date();
  if (d.validFrom && new Date(d.validFrom) > now) return false;
  if (d.validTo && new Date(d.validTo) < now) return false;
  return true;
}

function calcDiscount(price: number, d: Discount): number {
  if (d.type === "PERCENT") return Math.round(price - (price * d.value / 100));
  return Math.max(price - d.value, 0);
}

export default function LibraryDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: library, isLoading } = useLibrary(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Library not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const pricing = library.pricing as Record<string, number>;
  const shifts = (library.shifts as string[]) ?? [];
  const discount = (library as any).discount as Discount | null;
  const hasDiscount = isDiscountActive(discount);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-6 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Left: Photos + Info */}
          <div className="lg:col-span-2 space-y-6">
            <PhotoCarousel photos={library.photos ?? []} />

            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{library.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{library.address}</span>
                </div>
                {(library as any).seats_left != null && (
                  <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold text-white ${(library as any).seats_left < 5 ? 'bg-red-500' : (library as any).seats_left <= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    <Users className="h-3.5 w-3.5" />
                    {(library as any).seats_left} seats left
                  </span>
                )}
              </div>
            </div>

            {library.google_maps_url && (
              <Button asChild variant="outline" className="gap-2">
                <a href={library.google_maps_url} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            )}

            {/* Pricing */}
            {Object.keys(pricing).length > 0 && (
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-foreground">Pricing</h2>
                  {hasDiscount && discount && (
                    <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                      {discount.type === "PERCENT" ? `${discount.value}% off` : `₹${discount.value} off`}
                    </span>
                  )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {Object.entries(pricing).map(([key, value]) => {
                    const discounted = hasDiscount && discount ? calcDiscount(value, discount) : null;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg border bg-card p-4"
                      >
                        <span className="capitalize text-muted-foreground">{key}</span>
                        <div className="flex items-center gap-1.5">
                          {discounted !== null ? (
                            <>
                              <div className="flex items-center gap-0.5 font-bold text-primary">
                                <IndianRupee className="h-4 w-4" />
                                {discounted}
                              </div>
                              <span className="text-sm text-muted-foreground line-through">₹{value}</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-0.5 font-bold text-foreground">
                              <IndianRupee className="h-4 w-4" />
                              {value}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shifts */}
            {shifts.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Available Shifts</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {shifts.map((s) => (
                    <div key={s} className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-sm">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {library.amenities && library.amenities.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {library.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
                    >
                      <Wifi className="h-3.5 w-3.5" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-card-foreground">
                Book Your Seat
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a shift and pay securely via Razorpay.
              </p>
              <div className="mt-5">
                <PaymentForm
                  libraryId={library.id}
                  libraryName={library.name}
                  libraryWhatsapp={(library as any).whatsapp_number || ""}
                  shifts={shifts}
                  pricing={pricing}
                  discount={discount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
