import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LayoutDashboard, Plus, Settings, LogOut, CalendarCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/library-bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/admin/library/new", label: "Add Library", icon: Plus },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const navContent = (
    <>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
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
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-sidebar px-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-sidebar-foreground">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpen className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-base font-bold text-sidebar-foreground">StudySpot</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile slide-out drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpen className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-base font-bold">StudySpot</span>
          <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-60 flex-col border-r bg-sidebar text-sidebar-foreground sticky top-0">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">StudySpot</span>
        </div>
        {navContent}
      </aside>
    </>
  );
}
