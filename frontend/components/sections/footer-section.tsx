"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useContactInfo } from "@/lib/contact-info";

const iconClass =
  "flex items-center justify-center w-[54px] h-[54px] rounded-full border border-white/20 text-white/70 hover:text-gold hover:border-gold transition-colors";

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface FooterSectionProps {
  onShowToast?: (message: string) => void;
}

export function FooterSection({ onShowToast }: FooterSectionProps = {}) {
  const info = useContactInfo();
  const [showTop, setShowTop] = useState(false);
  const [inView, setInView] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Arrow sirf tab dikhta hai jab footer viewport me ho (permanent nahi)
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowTop(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Footer viewport me aate hi sab elements neeche se smoothly aate hain
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Har element ke liye staggered slide-up + fade
  const reveal = (order: number) => ({
    className: `transition-all duration-700 ease-out ${
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`,
    style: { transitionDelay: `${order * 120}ms` },
  });

  // Khali link wale icons nahi dikhte
  const socials = [
    {
      key: "instagram",
      label: "Instagram",
      href: info.instagram,
      icon: <InstagramIcon />,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: info.facebook,
      icon: <FacebookIcon />,
    },
    { key: "x", label: "X", href: info.x, icon: <XIcon /> },
  ].filter((s) => s.href);

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#272763] text-line px-6 md:px-[5%] pt-[55px] md:pt-[70px] pb-8 overflow-hidden"
    >
      <div className="max-w-[1310px] mx-auto flex flex-col items-center text-center">
        {/* Social icons (centered circles) */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-[5px]">
            {socials.map((s, i) => {
              const r = reveal(i);
              return (
                <div key={s.key} className={r.className} style={r.style}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={iconClass}
                  >
                    {s.icon}
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Copyright + legal links */}
        <p
          className={`mt-8 mb-0 text-[14px] md:text-[15px] text-white leading-[1.8] ${
            reveal(socials.length + 1).className
          }`}
          style={reveal(socials.length + 1).style}
        >
          © {new Date().getFullYear()} Loomstone - All Rights Reserved -{" "}
          <Link
            href="/terms"
            className="text-white no-underline hover:text-gold transition-colors"
          >
            Terms of Service
          </Link>{" "}
          /{" "}
          <Link
            href="/privacy"
            className="text-white no-underline hover:text-gold transition-colors"
          >
            Privacy Policy
          </Link>
        </p>

        {/* Created by */}
        <a
          href="https://visitinglink.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 inline-flex items-center gap-2 text-[10px] text-line hover:text-gold ${
            reveal(socials.length + 2).className
          }`}
          style={reveal(socials.length + 2).style}
        >
          <span>Designed & Developed by VisitingLink</span>
          <Image
            src="/vl-logo.png"
            alt="Visiting Link"
            width={90}
            height={24}
            className="h-4 -mt-[1px] -ml-0.5 w-auto object-contain"
          />
        </a>
      </div>

      {/* Scroll to top button */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed left-6 bottom-6 md:left-[50px] md:bottom-[50px] z-40 flex items-center justify-center w-[56px] h-[56px] rounded-[3px] bg-white text-[#272763] shadow-md hover:bg-gold hover:text-white transition-all duration-300 ${
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <ChevronUp size={22} strokeWidth={3} />
      </button>
    </footer>
  );
}

export default FooterSection;
