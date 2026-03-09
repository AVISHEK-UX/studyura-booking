import * as React from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/logo.png";

type AuthMode = "signin" | "signup";

interface SignIn1Props {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, fullName: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: string;
}

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face",
];

const SignIn1: React.FC<SignIn1Props> = ({ onSignIn, onSignUp, loading, error: externalError, success }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [localError, setLocalError] = React.useState("");

  const displayError = localError || externalError;

  const handleBack = () => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      navigate(redirect);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setLocalError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      await onSignUp(email, password, fullName.trim());
    } else {
      await onSignIn(email, password);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-[hsl(152,32%,36%)] focus:ring-1 focus:ring-[hsl(152,32%,36%)]";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-auto bg-gradient-to-br from-[hsl(150,25%,8%)] via-[hsl(150,22%,10%)] to-[hsl(152,20%,6%)] px-4 py-12">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      {/* Glassmorphic card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-2 flex justify-center">
          <img src={logo} alt="studyura logo" className="h-14 w-14 rounded-xl" />
        </div>

        {/* Brand */}
        <h1 className="mb-8 text-center font-display text-2xl font-bold tracking-tight text-white">
          studyura
        </h1>

        {success && (
          <div className="mb-4 rounded-lg border border-[hsl(152,32%,36%)]/30 bg-[hsl(152,32%,36%)]/10 p-3 text-center text-sm text-[hsl(152,32%,50%)]">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              className={inputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {displayError && (
            <p className="text-sm text-red-400">{displayError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(152,32%,36%)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[hsl(152,32%,30%)] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>


          {/* Toggle mode */}
          <p className="text-center text-sm text-white/50">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setLocalError(""); }}
                  className="font-medium text-[hsl(152,32%,50%)] hover:underline"
                >
                  Sign up, it's free!
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setLocalError(""); }}
                  className="font-medium text-[hsl(152,32%,50%)] hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>

      {/* Social proof */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="max-w-xs text-center text-sm text-white/40">
          Join thousands of{" "}
          <span className="text-white/70">students</span> who are already using{" "}
          <span className="text-white/70">studyura</span>.
        </p>
        <div className="flex -space-x-2">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-8 w-8 rounded-full border-2 border-[hsl(150,25%,8%)] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
