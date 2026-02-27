import { useState, useEffect } from "react";
import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";

const SLIDES = [
  { src: hero1, alt: "Study space interior 1" },
  { src: hero2, alt: "Study space interior 2" },
  { src: hero3, alt: "Study space interior 3" },
];

const INTERVAL = 3500;
const TRANSITION = 900;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {SLIDES.map((slide, i) => (
        <img
          key={i}
          src={slide.src}
          alt={slide.alt}
          loading={i === 0 ? "eager" : "lazy"}
          {...(i === 0 ? { fetchPriority: "high" } : {})}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: i === current ? 1 : 0,
            transition: reduceMotion ? "none" : `opacity ${TRANSITION}ms ease-in-out`,
          }}
        />
      ))}
      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.25))",
        }}
      />
    </div>
  );
}
