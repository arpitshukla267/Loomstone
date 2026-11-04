"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface HeaderSectionProps {
  onShowToast?: (message: string) => void;
  onOpenInquiry?: () => void;
  activePage?: string;
}

// Layout: left = pehle 4 links, center = logo, right = baaki links + Brochure
const leftLinks: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Clientele", "/clientele"],
];

const rightLinks: [string, string][] = [
  ["Inspiration", "/inspiration"],
  // ["Designs & Projects", "/projects"]
  ["Blogs", "/blogs"],
  ["Contact Us", "/contact"],
];

const mobileLinks = [...leftLinks, ...rightLinks];

export function HeaderSection({
  onShowToast,
  onOpenInquiry,
  activePage,
}: HeaderSectionProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleDownloadBrochure = () => {
    router.push("/brochure");
  };

  const isLinkActive = (link: string, href: string) => {
    if (activePage) {
      return (
        activePage.toLowerCase() === link.toLowerCase() || activePage === href
      );
    }
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  // Scroll par header solid hota hai, top par transparent
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // solid = cream bg + dark text + chhota logo.
  // Home par: top par transparent/white text/bada logo, scroll ke baad solid.
  // Baaki pages par: hamesha solid.
  const solid = !isHome || scrolled || menuOpen;

  const desktopLinkClass = (active: boolean) =>
    `text-[11px] xl:text-sm 3xl:text-base 4xl:text-lg font-medium xl:tracking-[.03em] uppercase no-underline transition-colors duration-300 border-b-2 ${
      solid
        ? "text-navy"
        : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
    } ${active ? "border-gold" : "border-transparent"}`;

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-transparent shadow-none transition-[background-color,padding] duration-300 motion-reduce:transition-none ${
        solid ? "bg-[#FFFCF4] py-[6px]" : "bg-transparent py-[10px]"
      }`}
    >
      {/* Main row: 3 columns -> left links | logo | right links */}
      <div className="mx-auto grid h-[72px] max-w-[100vw] grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 lg:px-10 3xl:px-20 4xl:px-32 3xl:h-24">
        {/* LEFT */}
        <nav className="hidden items-center justify-start md:flex md:gap-4 lg:gap-6 xl:gap-8 3xl:gap-12 4xl:gap-16">
          {leftLinks.map(([link, href]) => (
            <Link
              key={link}
              href={href}
              className={desktopLinkClass(isLinkActive(link, href))}
            >
              {link}
            </Link>
          ))}
        </nav>
        <div className="md:hidden" />

        {/* CENTER: logo. Absolute hai, isliye bada hokar header ke bahar nikalta hai */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="relative block h-full w-24 md:w-44 3xl:w-56"
          aria-label="Loomstone home"
        >
          <Image
            src="/logo-vertical.png"
            alt="Loomstone Logo"
            width={160}
            height={50}
            priority
            className={`absolute left-1/2 top-1 -translate-x-1/2 w-auto max-w-none object-contain transition-[height] duration-500 ease-out motion-reduce:transition-none ${
              solid
                ? "h-[60px] md:h-[84px] 3xl:h-[100px]"
                : "h-28 md:h-48 3xl:h-56"
            }`}
          />
        </Link>

        {/* RIGHT */}
        <div className="flex items-center justify-end">
          <nav className="hidden items-center md:flex md:gap-4 lg:gap-6 xl:gap-8 3xl:gap-12 4xl:gap-16">
            {rightLinks.map(([link, href]) => (
              <Link
                key={link}
                href={href}
                className={desktopLinkClass(isLinkActive(link, href))}
              >
                {link}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleDownloadBrochure}
              className={`cursor-pointer border-0 bg-transparent text-[11px] font-bold uppercase transition-colors duration-300 xl:text-sm 3xl:text-base 4xl:text-lg ${
                solid
                  ? "text-navy"
                  : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
              }`}
            >
              Brochure
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className={`relative block h-6 w-6 cursor-pointer border-0 bg-transparent p-0 transition-colors duration-300 md:hidden ${
              solid ? "text-navy" : "text-white"
            }`}
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
      </div>

      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`absolute left-0 top-full h-[100dvh] w-full bg-black/40 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={`absolute left-0 top-full grid w-full bg-white shadow-none transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          menuOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0 overflow-hidden" aria-label="Mobile navigation">
          {/* px-3: panel ka side padding kam kiya gaya hai */}
          <div className="flex flex-col gap-1 px-3 pb-5 pt-3">
            {mobileLinks.map(([link, href], index) => {
              const active = isLinkActive(link, href);
              return (
                <Link
                  key={link}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{
                    transitionDelay: menuOpen ? `${90 + index * 50}ms` : "0ms",
                  }}
                  className={`flex items-center rounded-lg px-3 py-[13px] text-sm uppercase tracking-[.13em] no-underline transition-all duration-300 motion-reduce:transition-none ${
                    menuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-5 opacity-0"
                  } ${
                    active
                      ? "bg-gold/10 font-semibold text-navy"
                      : "font-medium text-cool active:bg-[#f3f5f7]"
                  }`}
                >
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
                  ? `${90 + mobileLinks.length * 50}ms`
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
