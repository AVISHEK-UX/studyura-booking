import { Home, CalendarDays, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/my-bookings", label: "Bookings", icon: CalendarDays },
  { to: "/favourites", label: "Favourites", icon: Heart },
] as const;

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${active && label === "Favourites" ? "fill-primary" : ""}`}
                strokeWidth={active ? 2.5 : 2}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
