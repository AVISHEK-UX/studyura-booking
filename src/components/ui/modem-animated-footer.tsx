import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  brandIcon?: React.ReactNode;
  className?: string;
}

export const Footer = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <footer className={cn("relative overflow-hidden bg-zinc-950 text-zinc-300", className)}>
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center">
            {/* Brand */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {brandName}
                </h2>
              </div>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                {brandDescription}
              </p>
            </div>

            {/* Social / Contact Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <span className="text-zinc-400">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Nav Links */}
            {navLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider + Copyright */}
          <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
            <span>©{new Date().getFullYear()} {brandName}. All rights reserved.</span>
          </div>
        </div>

        {/* Large background text watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none text-[12vw] font-black uppercase leading-none tracking-tighter text-zinc-900/50">
            {brandName.toUpperCase()}
          </span>
        </div>

        {/* Bottom logo */}
        <div className="flex items-center justify-center pb-8">
          <div className="relative z-10 h-16 w-16 opacity-30">
            {brandIcon || null}
          </div>
        </div>

        {/* Bottom line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Bottom shadow */}
        <div className="h-8 w-full bg-gradient-to-t from-black to-transparent" />
      </div>
    </footer>
  );
};
