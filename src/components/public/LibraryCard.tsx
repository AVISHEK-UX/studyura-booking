import { MapPin, IndianRupee, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Library } from "@/lib/types";
import OptimizedImage from "./OptimizedImage";
import { useFavourites } from "@/hooks/useFavourites";
import { useAuth } from "@/hooks/useAuth";

function getThumbUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.pathname.includes("/storage/v1/object/public/")) {
      u.pathname = u.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
      u.searchParams.set("width", "400");
      u.searchParams.set("quality", "60");
      return u.toString();
    }
  } catch {}
  return url;
}

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

export default function LibraryCard({ library, compact = false }: { library: Library; compact?: boolean }) {
  const { user } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const navigate = useNavigate();
  const fav = isFavourite(library.id);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    toggleFavourite(library.id);
  };
  const pricing = library.pricing as Record<string, number>;
  const priceEntries = Object.entries(pricing ?? {}).filter(([, v]) => typeof v === "number");
  const monthlyPrice = pricing?.monthly ?? pricing?.daily ?? (priceEntries.length > 0 ? priceEntries[0][1] : undefined);
  const priceLabel = pricing?.monthly ? "/month" : pricing?.daily ? "/day" : priceEntries.length > 0 ? `/${priceEntries[0][0]}` : "";

  const discount = (library as any).discount as Discount | null | undefined;
  const hasDiscount = isDiscountActive(discount);
  let discountedPrice: number | null = null;
  let discountLabel = "";

  if (hasDiscount && monthlyPrice && discount) {
    if (discount.type === "PERCENT") {
      discountedPrice = Math.round(monthlyPrice - (monthlyPrice * discount.value / 100));
      discountLabel = `${discount.value}% off`;
    } else {
      discountedPrice = Math.max(monthlyPrice - discount.value, 0);
      discountLabel = `₹${discount.value} off`;
    }
  }

  return (
    <Link
      to={`/library/${library.id}`}
      className="group block overflow-hidden rounded-lg border bg-card shadow-card transition-gpu hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className={`relative overflow-hidden bg-muted ${compact ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        {library.photos && library.photos.length > 0 ? (
          <OptimizedImage
            src={getThumbUrl(library.photos[0])}
            alt={library.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            aspectRatio={compact ? "aspect-[16/9]" : "aspect-[4/3]"}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookPlaceholder />
          </div>
        )}
        {discountLabel && (
          <span className="absolute top-2 left-2 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground shadow-md">
            {discountLabel}
          </span>
        )}
        <button
          onClick={handleFavClick}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95"
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-foreground"}`}
          />
        </button>
        {(library as any).seats_left != null && (
          <span className={`absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-bold text-white shadow-md ${(library as any).seats_left < 5 ? 'bg-red-500' : (library as any).seats_left <= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
            {(library as any).seats_left} seats left
          </span>
        )}
      </div>
      <div className={compact ? "p-2.5" : "p-3"}>
        <h3 className="font-display text-base font-semibold text-card-foreground line-clamp-1">
          {library.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{library.address}</span>
        </div>
        {monthlyPrice && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <IndianRupee className="h-3.5 w-3.5 text-primary" />
              {discountedPrice !== null ? (
                <>
                  <span className="text-base font-bold text-primary">{discountedPrice}</span>
                  <span className="text-xs text-muted-foreground line-through ml-1">₹{monthlyPrice}</span>
                </>
              ) : (
                <span className="text-base font-bold text-primary">{monthlyPrice}</span>
              )}
              <span className="text-xs text-muted-foreground">{priceLabel}</span>
            </div>
            {discountLabel && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {discountLabel}
              </span>
            )}
          </div>
        )}
        {library.amenities && library.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {library.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {a}
              </span>
            ))}
            {library.amenities.length > 3 && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                +{library.amenities.length - 3}
              </span>
            )}
          </div>
        )}
        {(() => {
          const cm = (library as any).crowd_meter as { label: string; percentage: number }[] | null;
          if (!cm || cm.length === 0) return null;
          const sorted = [...cm].sort((a, b) => b.percentage - a.percentage).slice(0, 4);
          const total = sorted.reduce((s, c) => s + c.percentage, 0);
          const colors = [
            "bg-primary",
            "bg-emerald-500",
            "bg-amber-500",
            "bg-violet-500",
          ];
          const dotColors = [
            "bg-primary",
            "bg-emerald-500",
            "bg-amber-500",
            "bg-violet-500",
          ];
          return (
            <div className="mt-3 space-y-1.5">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                {sorted.map((cat, i) => (
                  <div
                    key={cat.label}
                    className={`${colors[i]} transition-all duration-500 ${i === 0 ? 'rounded-l-full' : ''} ${i === sorted.length - 1 ? 'rounded-r-full' : ''}`}
                    style={{ width: `${total > 0 ? (cat.percentage / total) * 100 : 0}%` }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {sorted.map((cat, i) => (
                  <span key={cat.label} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColors[i]}`} />
                    {cat.label} {cat.percentage}%
                  </span>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </Link>
  );
}

function BookPlaceholder() {
  return (
    <svg className="h-16 w-16 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
