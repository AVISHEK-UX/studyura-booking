import { useState, useMemo, useEffect } from "react";
import { useLibraries } from "@/hooks/useLibraries";
import { useUserLocation } from "@/hooks/useUserLocation";
import Header from "@/components/public/Header";
import LibraryCard from "@/components/public/LibraryCard";
import LocationPrompt from "@/components/public/LocationPrompt";
import { BookOpen, MapPin, Search, IndianRupee, Navigation, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSlideshow from "@/components/public/HeroSlideshow";

const PRICE_RANGES = [
  { label: "Any Price", value: "all" },
  { label: "Under ₹1,000", value: "0-1000" },
  { label: "₹1,000 – ₹2,000", value: "1000-2000" },
  { label: "₹2,000 – ₹5,000", value: "2000-5000" },
  { label: "₹5,000+", value: "5000-999999" },
];

export default function Index() {
  const { data: libraries, isLoading, error, refetch } = useLibraries();
  const { city: detectedCity, loading: locationLoading, prompted, requestLocation, setPrompted } = useUserLocation();
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsExpanded(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cities = useMemo(() => {
    if (!libraries) return [];
    const unique = [...new Set(libraries.map((l) => l.city).filter(Boolean))] as string[];
    return unique.sort();
  }, [libraries]);

  // Show location prompt on first visit (after libraries load)
  useEffect(() => {
    if (!prompted && !isLoading) {
      setShowLocationPrompt(true);
    }
  }, [prompted, isLoading]);

  // Auto-set city filter when location is detected
  useEffect(() => {
    if (detectedCity && cities.length > 0) {
      const match = cities.find(
        (c) => c.toLowerCase() === detectedCity.toLowerCase()
      );
      if (match) setSelectedCity(match);
    }
  }, [detectedCity, cities]);

  const filtered = useMemo(() => {
    if (!libraries) return [];
    return libraries.filter((lib) => {
      if (selectedCity !== "all" && lib.city !== selectedCity) return false;
      if (searchName.trim() && !lib.name.toLowerCase().includes(searchName.toLowerCase()) && !lib.address?.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        const pricing = lib.pricing as Record<string, number>;
        const price = pricing?.monthly ?? pricing?.daily ?? 0;
        if (price < min || price > max) return false;
      }
      return true;
    });
  }, [libraries, selectedCity, searchName, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAllowLocation = async () => {
    await requestLocation();
    setShowLocationPrompt(false);
  };

  const handleSkipLocation = () => {
    setPrompted();
    setShowLocationPrompt(false);
  };

  const handleNearMe = async () => {
    const city = await requestLocation();
    if (city && cities.length > 0) {
      const match = cities.find((c) => c.toLowerCase() === city.toLowerCase());
      if (match) setSelectedCity(match);
    }
  };

  return (
    <div className="min-h-screen">
      <LocationPrompt
        open={showLocationPrompt}
        loading={locationLoading}
        onAllow={handleAllowLocation}
        onSkip={handleSkipLocation}
      />
      <div className="fixed inset-0 z-0">
        <HeroSlideshow />
      </div>

      <div className="relative z-10">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24">
        <div className="container relative text-center z-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            <BookOpen className="h-4 w-4" />
            Find your perfect study space
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Discover Libraries<br />Near You
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Browse top-rated study libraries, compare amenities & pricing, and book your seat instantly.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover sm:rounded-full"
          >
            <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <label className="absolute left-4 top-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:left-6 sm:top-3 sm:text-[11px]">
                    Where
                  </label>
                </div>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 bottom-2.5 h-4 w-4 text-muted-foreground sm:left-6 sm:bottom-4" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full appearance-none bg-transparent pb-2.5 pl-10 pr-4 pt-6 text-sm font-medium text-card-foreground focus:outline-none sm:pb-4 sm:pl-12 sm:pt-8"
                  >
                    <option value="all">All Locations</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative flex-1 min-w-0">
                <label className="absolute left-4 top-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:left-6 sm:top-3 sm:text-[11px]">
                  Search
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 bottom-2.5 h-4 w-4 text-muted-foreground sm:left-6 sm:bottom-4" />
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Library name or location"
                    className="w-full bg-transparent pb-2.5 pl-10 pr-4 pt-6 text-sm font-medium text-card-foreground placeholder:text-muted-foreground focus:outline-none sm:pb-4 sm:pl-12 sm:pt-8"
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex-1 min-w-0">
                  <label className="absolute left-4 top-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:left-6 sm:top-3 sm:text-[11px]">
                    Budget
                  </label>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-4 bottom-2.5 h-4 w-4 text-muted-foreground sm:left-6 sm:bottom-4" />
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full appearance-none bg-transparent pb-2.5 pl-10 pr-4 pt-6 text-sm font-medium text-card-foreground focus:outline-none sm:pb-4 sm:pl-12 sm:pr-16 sm:pt-8"
                    >
                      {PRICE_RANGES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="m-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 sm:m-2 sm:h-12 sm:w-12"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Near me chip */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleNearMe}
              disabled={locationLoading}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary/90"
            >
              <Navigation className="h-3.5 w-3.5" />
              {locationLoading ? "Detecting..." : "Near me"}
            </button>
          </div>
        </div>
      </section>

      {/* Library Grid */}
      <div className={`transition-all duration-500 ease-in-out backdrop-blur-sm py-10 sm:py-14 ${
        isExpanded
          ? "bg-background/95 rounded-t-3xl"
          : ""
      }`}>
        <main className={`container mx-auto transition-all duration-500 ${
          isExpanded ? "" : "rounded-2xl bg-background/80 p-6 sm:p-10"
        }`}>
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {selectedCity !== "all" ? `Libraries in ${selectedCity}` : "Available Libraries"}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {isLoading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "library" : "libraries"} found`}
        </p>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">Failed to load libraries.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">
            No libraries match your filters. Try adjusting your search.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((lib, i) => (
              <div key={lib.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 80}ms` }}>
                <LibraryCard library={lib} />
              </div>
            ))}
          </div>
        )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary-foreground/10 py-8">
        <div className="container text-center text-sm text-primary-foreground/60 space-y-2">
          <p>© {new Date().getFullYear()} StudyUra. Find your perfect study space.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="tel:8881189088" className="inline-flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors">
              <Phone className="h-3.5 w-3.5" /> 8881189088
            </a>
            <a href="mailto:studyura.helpdesk@gmail.com" className="inline-flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors">
              <Mail className="h-3.5 w-3.5" /> studyura.helpdesk@gmail.com
            </a>
            <a href="/privacy-policy" className="inline-flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
