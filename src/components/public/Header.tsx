import { BookOpen, User, CalendarDays, MessageCircle, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split("@")[0]
    || "User";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">StudyUra</span>
        </Link>
        <nav className="flex items-center gap-3">
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
                  <DropdownMenuItem onClick={() => navigate("/my-bookings")} className="cursor-pointer gap-2">
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
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Log In
              </Link>
            )
          )}
          <a
            href="https://wa.me/918960031211?text=I%20need%20to%20list%20my%20library"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            List My Library
          </a>
          <Link
            to="/admin/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
