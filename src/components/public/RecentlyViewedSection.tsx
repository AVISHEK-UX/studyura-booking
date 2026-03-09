import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import type { Library } from "@/lib/types";
import OptimizedImage from "./OptimizedImage";
import { useFavourites } from "@/hooks/useFavourites";
import { useAuth } from "@/hooks/useAuth";

function getThumbUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.pathname.includes("/storage/v1/object/public/")) {
      u.pathname = u.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
      u.searchParams.set("width", "300");
      u.searchParams.set("quality", "60");
      return u.toString();
    }
  } catch {}
  return url;
}

interface Props {
  libraries: Library[];
  recentIds: string[];
}

export default function RecentlyViewedSection({ libraries, recentIds }: Props) {
  const { user } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  const recentLibraries = recentIds
    .map((id) => libraries.find((l) => l.id === id))
    .filter(Boolean) as Library[];

  if (recentLibraries.length === 0) return null;

  const handleFavClick = (e: React.MouseEvent, libraryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    toggleFavourite(libraryId);
  };

  return (
    <section className="px-4 py-6">
      <div className="container">
        <h3 className="font-display text-lg font-bold text-primary-foreground sm:text-xl mb-3">
          Recently viewed →
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {recentLibraries.map((lib) => {
            const pricing = lib.pricing as Record<string, number>;
            const price = pricing?.monthly ?? pricing?.daily;
            const fav = isFavourite(lib.id);

            return (
              <Link
                key={lib.id}
                to={`/library/${lib.id}`}
                className="shrink-0 snap-start w-[40vw] max-w-[180px] group"
              >
                <div className="relative rounded-xl overflow-hidden aspect-square bg-muted">
                  {lib.photos && lib.photos.length > 0 ? (
                    <OptimizedImage
                      src={getThumbUrl(lib.photos[0])}
                      alt={lib.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      aspectRatio="aspect-square"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground/30 text-3xl">📚</div>
                  )}
                  <button
                    onClick={(e) => handleFavClick(e, lib.id)}
                    className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm shadow transition-transform hover:scale-110 active:scale-95"
                    aria-label={fav ? "Remove from favourites" : "Add to favourites"}
                  >
                    <Heart className={`h-3.5 w-3.5 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                  </button>
                </div>
                <div className="mt-1.5 px-0.5">
                  <p className="text-sm font-semibold text-primary-foreground line-clamp-1">{lib.name}</p>
                  <div className="flex items-center gap-1 text-xs text-primary-foreground/60">
                    {lib.city && (
                      <>
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{lib.city}</span>
                      </>
                    )}
                    {price && <span className="ml-auto font-medium">₹{price}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
