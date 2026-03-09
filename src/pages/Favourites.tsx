import { useAuth } from "@/hooks/useAuth";
import { useFavourites } from "@/hooks/useFavourites";
import { useLibraries } from "@/hooks/useLibraries";
import Header from "@/components/public/Header";
import LibraryCard from "@/components/public/LibraryCard";
import BottomNav from "@/components/public/BottomNav";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

export default function Favourites() {
  const { user, loading: authLoading } = useAuth();
  const { favourites } = useFavourites();
  const { data: libraries } = useLibraries();

  const favLibraries = useMemo(
    () => (libraries ?? []).filter((l) => favourites.includes(l.id)),
    [libraries, favourites]
  );

  if (!authLoading && !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          My Favourites
        </h1>
        <p className="mt-1 text-muted-foreground">
          {favLibraries.length} {favLibraries.length === 1 ? "library" : "libraries"} saved
        </p>

        {favLibraries.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center text-muted-foreground">
            <Heart className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No favourites yet</p>
            <p className="text-sm mt-1">Tap the ❤️ on any library to save it here.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favLibraries.map((lib) => (
              <LibraryCard key={lib.id} library={lib} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
