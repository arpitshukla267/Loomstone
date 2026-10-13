import { Mail, MessageCircle, Phone } from 'lucide-react';

export function QuickActions() {
  return (
    <aside className="fixed z-40 right-3 md:right-6 bottom-[20px] md:bottom-[30px] flex flex-col gap-3">
      {/* Floating Call button */}
      <a
        href="tel:+33142680000"
        aria-label="Call"
        title="Call Us"
        className="grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full text-navy bg-white border border-line shadow-[0_8px_24px_rgba(42,41,103,0.18)] hover:text-white hover:bg-navy hover:scale-105 transition-all duration-200"
      >
        <Phone size={20} />
      </a>

      {/* Floating Email button */}
      <a
        href="mailto:concierge@loomstone.com"
        aria-label="Email"
        title="Email Us"
        className="grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full text-navy bg-white border border-line shadow-[0_8px_24px_rgba(42,41,103,0.18)] hover:text-white hover:bg-navy hover:scale-105 transition-all duration-200"
      >
        <Mail size={20} />
      </a>

      {/* Floating WhatsApp button */}
      <a
        className="grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full text-white bg-[#25D366] border-0 shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:scale-105 hover:bg-[#20ba59] transition-all duration-200"
        href="https://wa.me/33142680000"
        aria-label="WhatsApp"
        title="WhatsApp Chat"
      >
        <MessageCircle size={22} />
      </a>
    </aside>
  );
}

export default QuickActions;
