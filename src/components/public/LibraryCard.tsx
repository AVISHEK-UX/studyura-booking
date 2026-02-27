import { MapPin, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import type { Library } from "@/lib/types";
import OptimizedImage from "./OptimizedImage";

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

export default function LibraryCard({ library }: { library: Library }) {
  const pricing = library.pricing as Record<string, number>;
  const monthlyPrice = pricing?.monthly ?? pricing?.daily;
  const priceLabel = pricing?.monthly ? "/month" : pricing?.daily ? "/day" : "";

  return (
    <Link
      to={`/library/${library.id}`}
      className="group block overflow-hidden rounded-lg border bg-card shadow-card transition-gpu hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {library.photos && library.photos.length > 0 ? (
          <OptimizedImage
            src={getThumbUrl(library.photos[0])}
            alt={library.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            aspectRatio="aspect-[4/3]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookPlaceholder />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1">
          {library.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{library.address}</span>
        </div>
        {monthlyPrice && (
          <div className="mt-3 flex items-center gap-0.5">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">{monthlyPrice}</span>
            <span className="text-sm text-muted-foreground">{priceLabel}</span>
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
