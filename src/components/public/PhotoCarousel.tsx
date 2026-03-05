import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoCarousel({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));

  const go = useCallback(
    (dir: -1 | 1) => {
      setCurrent((c) => {
        const next = (c + dir + photos.length) % photos.length;
        setLoaded((prev) => new Set(prev).add(next));
        return next;
      });
    },
    [photos.length]
  );

  if (!photos || photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted">
        <span className="text-muted-foreground">No photos available</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-[4/3] relative bg-muted">
        {photos.map((url, i) => (
          <img
            key={i}
            src={loaded.has(i) ? url : undefined}
            data-src={url}
            alt={`Photo ${i + 1}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            onLoad={() => setLoaded((prev) => new Set(prev).add(i))}
          />
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-1.5 shadow backdrop-blur-sm transition-gpu hover:bg-card hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 text-card-foreground" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-1.5 shadow backdrop-blur-sm transition-gpu hover:bg-card hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 text-card-foreground" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setLoaded((prev) => new Set(prev).add(i));
                }}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary-foreground scale-125" : "bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
