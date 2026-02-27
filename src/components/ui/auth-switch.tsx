import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type AuthMode = "signin" | "signup";

interface AuthSwitchProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: string;
}

export function AuthSwitch({ onSignIn, onSignUp, loading, error, success }: AuthSwitchProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (mode === "signup" && password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    if (mode === "signin") {
      await onSignIn(email, password);
    } else {
      await onSignUp(email, password);
    }
  };

  const displayError = localError || error;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Tab toggle */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => { setMode("signin"); setLocalError(""); }}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
            mode === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode("signup"); setLocalError(""); }}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
            mode === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sign Up
        </button>
      </div>

      {success && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-center text-sm text-primary">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {displayError && (
          <p className="text-sm text-destructive">{displayError}</p>
        )}

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
