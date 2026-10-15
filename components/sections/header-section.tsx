"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface HeaderSectionProps {
  onShowToast?: (message: string) => void;
  onOpenInquiry?: () => void;
  activePage?: string;
}

// ---- Top bar ke contact details: yahan apne asli details bharo ----
// Khaali chhodoge to option /contact page par le jayega.
const CONTACT = {
  email: "", // jaise "hello@yourdomain.com"
  whatsapp: "", // country code ke saath, jaise "919876543210"
  phone: "", // jaise "+919876543210"
};

const TOP_MESSAGE_INTERVAL = 5000;

const topMessages: { label: string; href: string; external: boolean }[] = [
  {
    label: "Send an Email",
    href: CONTACT.email ? `mailto:${CONTACT.email}` : "/contact",
    external: Boolean(CONTACT.email),
  },
  {
    label: "Chat on WhatsApp",
    href: CONTACT.whatsapp
      ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`
      : "/contact",
    external: Boolean(CONTACT.whatsapp),
  },
  {
    label: "Inquiry Call",
    href: CONTACT.phone ? `tel:${CONTACT.phone}` : "/contact",
    external: Boolean(CONTACT.phone),
  },
];

function TopLink({
  href,
  external,
  className,
  tabIndex,
  children,
}: {
  href: string;
  external: boolean;
  className: string;
  tabIndex?: number;
  children: ReactNode;
}) {
  if (external) {
    const isWeb = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        tabIndex={tabIndex}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

export function HeaderSection({
  onShowToast,
  onOpenInquiry,
  activePage,
}: HeaderSectionProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // active = abhi dikhne wala option, prev = jo abhi slide hokar bahar gaya
  const [slide, setSlide] = useState({ active: 0, prev: -1 });

  const navLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Products", "/products"],
    ["Projects", "/projects"],
    ["Inspiration", "/inspiration"],
    ["Blogs", "/blogs"],
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

  const goMessage = (dir: 1 | -1) =>
    setSlide((s) => ({
      active: (s.active + dir + topMessages.length) % topMessages.length,
      prev: s.active,
    }));

  // Top bar ka option 5 second mein khud badalta hai (arrows se bhi badal sakte hain)
  useEffect(() => {
    const timer = window.setInterval(() => goMessage(1), TOP_MESSAGE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [slide.active]);

  // Scroll par header ka background aata hai, top par transparent rehta hai
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

  // solid = background wala header.
  // Home ("/") par: top par transparent, scroll ke baad ya mobile menu khulne par solid.
  // Baaki sab pages par: hamesha solid.
  const solid = !isHome || scrolled || menuOpen;

  const messageClassName =
    "text-[12px] md:text-[13px] text-white underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-gold";

  const inquiryClassName =
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-gold px-3.5 py-0 text-sm font-medium text-navy no-underline transition-colors duration-200 hover:bg-white md:gap-2 md:px-4 md:py-1.5 md:text-[12px]";

  return (
    <header
      className={`fixed z-50 top-0 w-full border-b transition-all duration-300 motion-reduce:transition-none ${
        solid
          ? "bg-white/95 border-[#e4e9ec] backdrop-blur-[14px]"
          : "bg-white/95 border-[#e4e9ec] backdrop-blur-[14px]"
      }`}
    >
      {/* Top bar: hamesha dikhta hai. Left mein arrows ke beech sliding contact options, right mein Inquiry button */}
      <div className="bg-navy">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between gap-4 px-6 md:h-10 lg:px-10">
          <div className="flex items-center gap-1 text-white/80">
            <button
              type="button"
              aria-label="Previous option"
              onClick={() => goMessage(-1)}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit transition-colors hover:text-gold"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Options ki window: naya option slide hokar aata hai, purana slide hokar jaata hai */}
            <div className="relative h-6 w-[130px] overflow-hidden md:w-[150px]">
              {topMessages.map((message, i) => {
                const isActive = i === slide.active;
                const rel =
                  (i - slide.active + topMessages.length) % topMessages.length;
                const animate = isActive || i === slide.prev;
                return (
                  <div
                    key={message.label}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 flex items-center justify-center ${
                      animate
                        ? "transition-all duration-500 ease-out motion-reduce:transition-none"
                        : "transition-none"
                    } ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : rel === 1
                          ? "pointer-events-none translate-x-full opacity-0"
                          : "pointer-events-none -translate-x-full opacity-0"
                    }`}
                  >
                    <TopLink
                      href={message.href}
                      external={message.external}
                      className={messageClassName}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {message.label}
                    </TopLink>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next option"
              onClick={() => goMessage(1)}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit transition-colors hover:text-gold"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {onOpenInquiry ? (
            <button
              type="button"
              onClick={onOpenInquiry}
              className={inquiryClassName}
            >
              <MessageSquare size={14} /> Inquiry
            </button>
          ) : (
            <Link href="/contact" className={inquiryClassName}>
              <MessageSquare size={14} /> Inquiry
            </Link>
          )}
        </div>
      </div>

      {/* Main row: scroll par height (padding) kam ho jaati hai */}
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-[30px] px-6 transition-[height] duration-300 motion-reduce:transition-none lg:px-10 ${
          scrolled ? "h-14 md:h-16" : "h-[68px] md:h-20"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo-horizontal.png"
            alt="Loomstone Logo"
            width={160}
            height={50}
            className={`-mx-6 w-auto rounded object-contain transition-[height] duration-300 motion-reduce:transition-none ${
              scrolled ? "h-24 md:h-28" : "h-28 md:h-36"
            }`}
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
                className={`text-xs font-medium tracking-[.13em] uppercase no-underline transition-colors duration-200 md:py-[7px] border-b-2 ${
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
          className="hidden md:inline-flex items-center justify-center gap-[9px] border-0 no-underline transition-all duration-200 ease-out py-[13px] px-[17px] text-white bg-navy text-xs font-medium tracking-[.03em] uppercase hover:bg-navy/90 hover:-translate-y-0.5 cursor-pointer rounded-full"
          onClick={handleDownloadBrochure}
        >
          <Download size={15} /> Download Brochure
        </button>

        {/* Mobile toggle: icon rotate + fade se badalta hai */}
        <button
          className={`relative block h-6 w-6 md:hidden border-0 bg-transparent p-0 cursor-pointer transition-colors duration-300 ${
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
