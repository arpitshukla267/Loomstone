'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products Archive', href: '/products' },
  { label: 'About Atelier', href: '/about' },
  { label: 'Projects & Contracts', href: '/projects' },
  { label: 'Inspiration Gallery', href: '/inspiration' },
  { label: 'Blogs & Stories', href: '/blogs' },
  { label: 'Direct Consultation', href: '/contact' },
  { label: 'Atelier CMS Portal', href: '/admin' },
];

const iconClass =
  'flex items-center justify-center w-9 h-9 rounded-full border border-white/25 text-white hover:text-gold hover:border-gold transition-colors';

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface FooterSectionProps {
  onShowToast?: (message: string) => void;
}

export function FooterSection({ onShowToast }: FooterSectionProps = {}) {
  return (
    <footer className="pt-[55px] md:pt-[70px] pb-6 px-6 md:px-[5%] text-line bg-[#22215c]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[45px] max-w-[1310px] mx-auto">
        {/* Column 1: Logo + description + social icons */}
        <div>
          <Link className="inline-flex items-center mb-[18px]" href="/">
            <Image
              src="/logo-horizontal.png"
              alt="Loomstone"
              width={140}
              height={45}
              className="h-16 w-auto object-cover rounded bg-white"
            />
          </Link>
          <p className="text-[12px] leading-[1.8] text-line max-w-[360px]">
            Bespoke textile architecture and premium hand-knotted &amp;
            Axminster floorcoverings engineered for luxury residences, hotels,
            and commercial spaces.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={iconClass}
            >
              <InstagramIcon />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={iconClass}
            >
              <FacebookIcon />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className={iconClass}
            >
              <XIcon />
            </a>
          </div>
        </div>

        {/* Column 2: Quick links */}
        <div>
          <h4 className="m-0 mb-[18px] text-white text-[10px] font-bold tracking-[.13em] uppercase">
            Quick Links
          </h4>
          <ul className="list-none m-0 p-0 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[12px] leading-[1.8] text-line no-underline hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="m-0 mb-[18px] text-white text-[10px] font-bold tracking-[.13em] uppercase">
            Contact
          </h4>
          <ul className="list-none m-0 p-0 space-y-3 text-[12px] leading-[1.8]">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-[5px] shrink-0 text-gold" />
              <span>54 Greene Street, SoHo, New York</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-gold" />
              <a
                href="tel:+10000000000"
                className="text-line no-underline hover:text-gold transition-colors"
              >
                +1 000 000 0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-gold" />
              <a
                href="mailto:hello@loomstone.com"
                className="text-line no-underline hover:text-gold transition-colors"
              >
                hello@loomstone.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1310px] mx-auto mt-[45px] pt-5 border-t border-white/[0.11] text-[10px] text-center md:text-left">
        © {new Date().getFullYear()} Loomstone. All rights reserved.
      </div>
    </footer>
  );
}

export default FooterSection;