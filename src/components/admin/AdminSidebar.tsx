import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LayoutDashboard, Plus, Settings, LogOut, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/library-bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/admin/library/new", label: "Add Library", icon: Plus },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <BookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold">StudySpot</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
