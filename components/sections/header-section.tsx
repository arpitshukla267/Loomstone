"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface HeaderSectionProps {
  onShowToast?: (message: string) => void;
  activePage?: string;
}

export function HeaderSection({ onShowToast, activePage }: HeaderSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Products", "/products"],
    ["Projects", "/projects"],
    ["Inspiration", "/inspiration"],
    ["Contact", "/contact"],
  ];

  const handleDownloadBrochure = () => {
    onShowToast?.("The Loomstone brochure is ready for your consultation.");
  };

  const isLinkActive = (link: string, href: string, index: number) => {
    if (activePage) {
      return (
        activePage.toLowerCase() === link.toLowerCase() ||
        activePage === href ||
        (activePage === "/" && href === "/")
      );
    }
    return index === 0;
  };

  // Menu khula ho to background scroll band, Esc se band, desktop size par auto close
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header className="fixed z-50 top-0 w-full bg-white/95 border-b border-[#e4e9ec] backdrop-blur-[14px]">
      <div className="h-[68px] md:h-20 max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-[30px]">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.jpeg"
            alt="Loomstone Logo"
            width={160}
            height={50}
            className="h-10 md:h-16 w-auto object-contain rounded"
            priority
          />
        </Link>

        {/* Desktop nav: pehle jaisa hi */}
        <nav className="hidden md:flex md:flex-row md:items-center md:gap-4 lg:gap-[27px]">
          {navLinks.map(([link, href], index) => {
            const active = isLinkActive(link, href, index);
            return (
              <Link
                key={link}
                href={href}
                className={`text-sm font-medium tracking-[.13em] uppercase no-underline transition-colors duration-200 md:py-[7px] border-b-2 ${
                  active
                    ? "text-navy border-gold"
                    : "text-cool border-transparent hover:text-navy hover:border-gold"
                }`}
              >
                {link}
              </Link>
            );
          })}
        </nav>

        <button
          className="hidden md:inline-flex items-center justify-center gap-[9px] border-0 no-underline transition-all duration-200 ease-out py-[13px] px-[17px] text-white bg-navy text-sm font-medium tracking-[.03em] uppercase hover:bg-navy/90 hover:-translate-y-0.5 cursor-pointer rounded-full"
          onClick={handleDownloadBrochure}
        >
          <Download size={15} /> Download Brochure
        </button>

        {/* Mobile toggle: icon rotate + fade se badalta hai */}
        <button
          className="relative block h-6 w-6 md:hidden border-0 bg-transparent text-navy p-0 cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu
            size={22}
            className={`absolute inset-0 m-auto transition-all duration-300 motion-reduce:transition-none ${
              menuOpen
                ? "rotate-90 scale-50 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            size={22}
            className={`absolute inset-0 m-auto transition-all duration-300 motion-reduce:transition-none ${
              menuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-50 opacity-0"
            }`}
          />
        </button>
      </div>

      {/* Mobile overlay: header ke neeche halka black, tap karne par menu band */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`md:hidden absolute left-0 top-full h-[100dvh] w-full bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile panel: height 0 se khulta hai (slide down), band hone par wapas slide up */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute left-0 top-full grid w-full bg-white shadow-lg transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${
          menuOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0 overflow-hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1 px-6 pb-6 pt-3">
            {navLinks.map(([link, href], index) => {
              const active = isLinkActive(link, href, index);
              return (
                <Link
                  key={link}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{
                    transitionDelay: menuOpen ? `${90 + index * 50}ms` : "0ms",
                  }}
                  className={`relative flex items-center rounded-lg py-[13px] pl-5 pr-4 text-sm tracking-[.13em] uppercase no-underline transition-all duration-300 motion-reduce:transition-none ${
                    menuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-5 opacity-0"
                  } ${
                    active
                      ? "bg-gold/10 font-semibold text-navy"
                      : "font-medium text-cool active:bg-[#f3f5f7]"
                  }`}
                >
                  {/* Active: underline ki jagah left gold bar + halka gold background */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-full bg-gold transition-all duration-300 motion-reduce:transition-none ${
                      active ? "h-6 opacity-100" : "h-0 opacity-0"
                    }`}
                  />
                  {link}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => {
                handleDownloadBrochure();
                setMenuOpen(false);
              }}
              style={{
                transitionDelay: menuOpen
                  ? `${90 + navLinks.length * 50}ms`
                  : "0ms",
              }}
              className={`mt-4 inline-flex w-full items-center justify-center gap-[9px] rounded-full border-0 bg-navy px-[17px] py-[14px] text-sm font-medium uppercase tracking-[.03em] text-white transition-all duration-300 active:bg-navy/90 motion-reduce:transition-none ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
            >
              <Download size={15} /> Download Brochure
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default HeaderSection;
