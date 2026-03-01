import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const SplashScreen = () => {
  const [phase, setPhase] = useState<"visible" | "fading" | "done">("visible");

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase("fading"), 2500);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (phase === "fading") {
      const fadeTimer = setTimeout(() => setPhase("done"), 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-foreground"
      style={{
        animation: phase === "fading" ? "splashFadeOut 0.5s ease-in forwards" : undefined,
      }}
    >
      <img
        src={logo}
        alt="StudyUra logo"
        className="w-24 h-24 md:w-32 md:h-32"
        style={{ animation: "splashLogoIn 0.8s ease-out both, splashPulse 2s ease-in-out 0.8s infinite" }}
      />
      <span
        className="mt-4 text-2xl md:text-3xl font-bold tracking-wide text-primary-foreground"
        style={{ fontFamily: "var(--font-display)", animation: "splashTextIn 0.6s ease-out 0.5s both" }}
      >
        StudyUra
      </span>
    </div>
  );
};

export default SplashScreen;
