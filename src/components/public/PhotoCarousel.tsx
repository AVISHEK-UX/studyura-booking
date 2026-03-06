import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function PhotoCarousel({ photos }: { photos: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted">
        <span className="text-muted-foreground">No photos available</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {photos.map((url, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className="aspect-[4/3]">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {photos.length > 1 && (
        <>
          {/* Image counter */}
          <div className="absolute bottom-3 right-3 z-10 rounded-full bg-foreground/70 px-3 py-1 text-xs font-semibold text-background backdrop-blur-sm">
            {current + 1} / {photos.length}
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
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
