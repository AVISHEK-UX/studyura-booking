import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, redirectTo, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    const { error: err } = await signUp(email, password, fullName);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    // Auto-confirm is on, so sign in immediately
    const { error: signInErr } = await signIn(email, password);
    if (signInErr) {
      setSuccess("Account created! Please log in.");
      setLoading(false);
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const isCustomDomain =
      !window.location.hostname.includes("lovable.app") &&
      !window.location.hostname.includes("lovableproject.com");

    if (isCustomDomain) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } else {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        setError(result.error instanceof Error ? result.error.message : String(result.error));
      }
    }
  };

  return (
    <SignIn1
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onGoogleSignIn={handleGoogleSignIn}
      loading={loading}
      error={error}
      success={success}
    />
  );
}
