import { useParams, Link } from "react-router-dom";
import { useLibrary } from "@/hooks/useLibraries";
import Header from "@/components/public/Header";
import PhotoCarousel from "@/components/public/PhotoCarousel";
import PaymentForm from "@/components/public/PaymentForm";
import { ArrowLeft, MapPin, Navigation, IndianRupee, Clock, Wifi, Loader2, Users, GraduationCap } from "lucide-react";
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
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-6 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Left: Photos + Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <PhotoCarousel photos={library.photos ?? []} />
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {library.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span className="uppercase tracking-wide text-sm">{library.address}</span>
                </div>
                {(library as any).seats_left != null && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md ${(library as any).seats_left < 5 ? 'bg-red-500' : (library as any).seats_left <= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    <Users className="h-3.5 w-3.5" />
                    {(library as any).seats_left} seats left
                  </span>
                )}
              </div>
            </div>

            {library.google_maps_url && (
              <Button asChild variant="outline" className="gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold">
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
                  <h2 className="font-display text-xl font-bold text-primary">Pricing</h2>
                  {hasDiscount && discount && (
                    <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground shadow-sm animate-pulse">
                      {discount.type === "PERCENT" ? `${discount.value}% off` : `₹${discount.value} off`}
                    </span>
                  )}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {Object.entries(pricing).map(([key, value]) => {
                    const discounted = hasDiscount && discount ? calcDiscount(value, discount) : null;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-xl border-2 border-border/60 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                      >
                        <span className="capitalize text-muted-foreground font-medium text-base">{key}</span>
                        <div className="flex items-center gap-2">
                          {discounted !== null ? (
                            <>
                              <div className="flex items-center gap-0.5 text-lg font-extrabold text-primary">
                                <IndianRupee className="h-4 w-4" />
                                {discounted}
                              </div>
                              <span className="text-sm text-muted-foreground line-through">₹{value}</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-0.5 text-lg font-extrabold text-foreground">
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
                <h2 className="font-display text-xl font-bold text-primary">Available Shifts</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {shifts.map((s) => (
                    <div key={s} className="flex items-center gap-2 rounded-xl border-2 border-border/60 bg-card px-4 py-3 text-sm font-medium shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200">
                      <Clock className="h-4 w-4 text-primary" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {library.amenities && library.amenities.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {library.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-semibold text-primary"
                    >
                      <Wifi className="h-3.5 w-3.5" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Crowd Meter */}
            {(() => {
              const crowdMeter = (library as any).crowd_meter as { label: string; percentage: number }[] | null;
              if (!crowdMeter || crowdMeter.length === 0) return null;
              return (
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-bold text-primary">Students Preparing For</h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {crowdMeter.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-foreground">{item.label}</span>
                          <span className="text-xs font-bold text-primary">{item.percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg">
              <h2 className="font-display text-xl font-bold text-primary">
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
