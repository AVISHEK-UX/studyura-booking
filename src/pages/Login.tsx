import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";

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

  return (
    <SignIn1
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      loading={loading}
      error={error}
      success={success}
    />
  );
}
