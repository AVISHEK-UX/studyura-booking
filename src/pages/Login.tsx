import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { BookOpen, Loader2, ArrowLeft, Mail, ShieldCheck } from "lucide-react";

export default function Login() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithOtp, verifyOtp, user } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";

  // If already logged in, redirect
  if (user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await signInWithOtp(email);
    if (error) {
      setError(error);
    } else {
      setSuccess("OTP sent to your email. Check your inbox.");
      setStep("otp");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await verifyOtp(email, otp);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Welcome to StudyUra</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "email"
                ? "Enter your email to receive a one-time password."
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {success && step === "otp" && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-center text-sm text-primary">
              {success}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Label>Enter OTP</Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && <p className="text-sm text-center text-destructive">{error}</p>}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Verify & Log In
              </Button>

              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
