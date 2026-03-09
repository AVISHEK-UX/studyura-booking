import { useState, useEffect } from "react";
import { User, CalendarDays, MessageCircle, LogOut, ChevronDown, Menu, X, Headset } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppConfig } from "@/hooks/useLibraries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { openExternalUrl } from "@/lib/capacitor-utils";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const { data: appConfig } = useAppConfig();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY >= 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split("@")[0]
    || "User";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = (
    <>
      {!loading && (
        user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus:outline-none">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-[120px] truncate">{displayName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => { navigate("/my-bookings"); setMobileOpen(false); }} className="cursor-pointer gap-2">
                <CalendarDays className="h-4 w-4" />
                My Bookings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <User className="h-4 w-4" />
            Log In
          </Link>
        )
      )}
      <button
        type="button"
        onClick={() => {
          const supportNumber = appConfig?.whatsapp_number || "918960031211";
          openExternalUrl(`https://wa.me/${supportNumber}?text=${encodeURIComponent("Hi, I need help with studyura app.")}`);
        }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Headset className="h-4 w-4" />
        Get Support
      </button>
      <button
        type="button"
        onClick={() => openExternalUrl("https://wa.me/918960031211?text=I%20need%20to%20list%20my%20library")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <MessageCircle className="h-4 w-4" />
        List My Library
      </button>
    </>
  );

  return (
    <>
      <div className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out motion-reduce:transition-none ${isMobile ? 'top-2' : 'top-0'}`}
        style={{ padding: isScrolled && isMobile ? '8px 16px 0' : '0' }}
      >
        <header
          className={[
            "w-full transition-all duration-300 ease-in-out motion-reduce:transition-none",
            isScrolled && isMobile
              ? "max-w-[900px] rounded-full bg-background/95 backdrop-blur-xl shadow-lg border border-border/40"
              : "bg-background border-b border-border/20",
          ].join(" ")}
        >
          <div
            onClick={() => isMobile && setMobileOpen(!mobileOpen)}
            className={[
              "flex items-center justify-between transition-all duration-300 ease-in-out px-6",
              isScrolled && isMobile ? "h-14" : "h-16",
              isMobile ? "cursor-pointer" : "",
            ].join(" ")}
          >
            <Link to="/" className="flex items-center gap-2" onClick={(e) => isMobile && e.stopPropagation()}>
              <img src={logo} alt="studyura logo" className={`rounded-lg object-contain transition-all duration-300 ${isScrolled && isMobile ? 'h-7 w-7' : 'h-8 w-8'}`} />
              <span className="font-display text-lg font-bold text-foreground">studyura</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-3">
              {navLinks}
              <Link
                to="/admin/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile hamburger icon (visual only, parent handles click) */}
            <div className="md:hidden p-2 text-foreground pointer-events-none">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <nav className={[
              "md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 flex flex-col gap-3 animate-fade-in",
              isScrolled && isMobile ? "rounded-b-3xl" : "",
            ].join(" ")}>
              {navLinks}
            </nav>
          )}
        </header>
      </div>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
