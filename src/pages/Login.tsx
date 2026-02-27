import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/public/Header";
import { AuthSwitch } from "@/components/ui/auth-switch";
import { BookOpen } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Check your email for a verification link to complete your sign-up.");
    }
    setLoading(false);
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
              Sign in or create an account to book your study space.
            </p>
          </div>

          <AuthSwitch
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      </div>
    </div>
  );
}
