'use client';

import { useState } from 'react';
import { ArrowRight, Check, Clock3, Factory, Headphones, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import { PageFrame, SectionHeading, siteImages } from '@/components/site/site-chrome';

const salons = [
  { country: 'France', name: 'Paris Showroom', address: "14 Rue de l'Université, 75007 Paris, France", phone: '+33 1 42 68 00 20', note: 'Rive Gauche', icon: MapPin },
  { country: 'Italia', name: 'Milan Studio', address: 'Via Solferino 21, Brera, 20121 Milan, Italy', phone: '+39 02 87 39 40 10', note: 'Brera Design District', icon: MapPin },
  { country: 'United States', name: 'New York Showroom', address: '54 Greene Street, SoHo, New York, NY 10013', phone: '+1 212 941 7800', note: 'Cast Iron District', icon: MapPin },
  { country: 'India', name: 'Jaipur Workshops', address: 'Amber Road Craft Enclave, Jaipur, India', phone: 'Visits welcome', note: 'By appointment', icon: Factory },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageFrame active="Contact">
      {/* Inner Hero */}
      <section className="bg-white flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-[60px] min-h-auto md:min-h-[420px] pt-[130px] md:pt-[170px] pb-[55px] md:pb-[70px] px-6 md:px-[5%]">
        <div className="max-w-[800px]">
          <span className="inline-flex items-center gap-2 text-gold text-[10px] font-bold tracking-[.13em] uppercase">
            <i className="w-2 h-2 inline-block bg-gold not-italic" />
            SHOWROOM VISITS &amp; CUSTOM INQUIRIES
          </span>
          <h1 className="my-4 md:my-5 text-navy font-manrope font-semibold text-[45px] md:text-[clamp(42px,6vw,72px)] leading-[1.08] tracking-[-0.03em]">
            Get in touch / <em className="text-gold not-italic">start a custom order.</em>
          </h1>
          <p className="max-w-[650px] m-0 text-cool text-[15px] md:text-[17px] leading-[1.8]">
            Connect with our design team. From choosing your rug size and color to handweaving and delivery, we work closely with homeowners, interior designers, and architects.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0">
          <div className="flex items-center gap-2.5 p-[15px] bg-ash border border-[#dbe1e5] text-gold">
            <ShieldCheck size={18} />
            <span className="text-navy text-[9px] font-bold tracking-[.1em] uppercase block">
              Showroom visits
              <small className="block mt-1 text-cool text-[11px] font-normal normal-case tracking-normal">
                By appointment
              </small>
            </span>
          </div>
          <div className="flex items-center gap-2.5 p-[15px] bg-ash border border-[#dbe1e5] text-gold">
            <Clock3 size={18} />
            <span className="text-navy text-[9px] font-bold tracking-[.1em] uppercase block">
              Quick response
              <small className="block mt-1 text-cool text-[11px] font-normal normal-case tracking-normal">
                Within 12 hours
              </small>
            </span>
          </div>
        </div>
      </section>

      {/* Contact Layout */}
      <section className="py-[50px] md:py-[100px] px-6 md:px-[5%] max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {/* Salons Panel */}
            <div className="bg-white border border-[#dbe1e5] p-[25px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-[15px] mb-[15px] border-b border-[#dbe1e5]">
                <span className="flex items-center gap-2 text-navy text-[10px] font-bold tracking-[.12em] uppercase">
                  <MapPin size={14} className="text-gold" /> INTERNATIONAL ATELIERS
                </span>
                <small className="text-[#8a9298] text-[9px]">01 / 04 LOCATIONS</small>
              </div>
              <div className="flex flex-col gap-2.5">
                {salons.map(({ country, name, address, phone, note, icon: Icon }) => (
                  <div
                    className="p-3.5 bg-ash border border-[#dbe1e5] border-l-[3px] border-l-navy"
                    key={name}
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-block px-1.5 py-0.5 text-white bg-navy text-[8px] font-bold tracking-[.1em] uppercase">
                        {country}
                      </span>
                      <Icon size={18} className="text-gold" />
                    </div>
                    <h3 className="my-1.5 text-navy font-manrope font-normal text-[20px]">{name}</h3>
                    <p className="text-cool text-[11px] m-0 mb-2">{address}</p>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2.5 pt-2.5 border-t border-[#dbe1e5]">
                      <a href={`tel:${phone.replaceAll(' ', '')}`} className="text-navy text-[10px] font-bold no-underline hover:text-gold transition-colors">
                        {phone}
                      </a>
                      <small className="text-[#8a9298] text-[10px]">{note}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concierge Panel */}
            <div className="bg-ash border border-[#dbe1e5] p-[25px]">
              <div className="flex items-center justify-between pb-[15px] mb-[15px] border-b border-[#dbe1e5]">
                <span className="flex items-center gap-2 text-navy text-[10px] font-bold tracking-[.12em] uppercase">
                  <Headphones size={16} className="text-gold" /> DIRECT CONCIERGE CHANNELS
                </span>
              </div>
              <p className="text-cool text-xs leading-[1.7] m-0 mb-3">
                Our senior textile engineers provide direct swatch availability, knot density feasibility calculations, and expedited trade accounts.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/33140502010"
                  className="flex items-center justify-between p-3.5 bg-white border border-[#dbe1e5] text-navy text-[10px] font-bold tracking-[.08em] uppercase no-underline hover:border-gold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="text-gold" /> WhatsApp chat
                  </span>
                  <ArrowRight size={15} />
                </a>
                <a
                  href="mailto:hello@atelierterroir.com"
                  className="flex items-center justify-between p-3.5 bg-white border border-[#dbe1e5] text-navy text-[10px] font-bold tracking-[.08em] uppercase no-underline hover:border-gold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-gold" /> Email inquiries
                  </span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            {/* Tactile Archive Vignette */}
            <div className="bg-white border border-[#dbe1e5] overflow-hidden">
              <img
                src={siteImages.wool}
                alt="Highland wool texture"
                className="w-full h-[230px] object-cover block"
              />
              <span className="block pt-3.5 px-[18px] text-gold text-[9px] font-bold tracking-[.12em] uppercase">
                TACTILE ARCHIVE
              </span>
              <p className="block px-[18px] pb-4 m-0 text-navy font-manrope font-normal text-[20px]">
                Study in Highland Wool &amp; Raw Flax, Specimen #84
              </p>
            </div>
          </aside>

          {/* Form / Success Panel */}
          <div className="bg-white border border-[#dbe1e5] p-[25px] md:p-8">
            <div className="flex items-center justify-between pb-[15px] mb-[15px] border-b border-[#dbe1e5]">
              <span className="text-navy text-[10px] font-bold tracking-[.12em] uppercase">
                PROJECT INQUIRY
              </span>
              <small className="text-[#8a9298] text-[9px]">FORM ID: TR-2025</small>
            </div>

            {sent ? (
              <div className="py-10 md:py-[70px] px-2 md:px-5 text-center">
                <div className="grid place-items-center w-[55px] h-[55px] mx-auto mb-5 text-gold border border-gold rounded-full">
                  <Check size={24} />
                </div>
                <span className="inline-flex items-center gap-2 text-gold text-[10px] font-bold tracking-[.13em] uppercase">
                  <i className="w-2 h-2 inline-block bg-gold not-italic" />
                  REGISTRATION TRANSMITTED
                </span>
                <h2 className="my-3 text-navy font-manrope font-normal text-[28px] md:text-[34px]">
                  Commission dossier logged.
                </h2>
                <p className="max-w-[450px] mx-auto mb-6 text-cool text-[13px] md:text-[14px] leading-[1.8]">
                  Your specifications have been assigned to an Atelier Terroir textile engineer. We will be in touch within 12 business hours.
                </p>
                <button
                  className="inline-flex items-center justify-center min-h-[50px] px-6 text-white bg-navy text-[10px] font-bold tracking-[.13em] uppercase border-0 cursor-pointer hover:bg-navy/90 transition-colors"
                  onClick={() => setSent(false)}
                >
                  Start another inquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="my-2 text-navy font-manrope font-normal text-[28px] md:text-[31px]">
                  Tell us about your project.
                </h2>
                <p className="text-cool text-[13px] leading-[1.7] m-0 mb-6">
                  Fill out the form below to discuss your custom rug ideas or request free sample swatches.
                </p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSent(true);
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                      Full name
                      <input
                        required
                        placeholder="e.g. Jean-Michel Moreau"
                        className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                      Company or residence
                      <input
                        placeholder="e.g. Moreau Architecture Studio"
                        className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                      Email address
                      <input
                        required
                        type="email"
                        placeholder="j.moreau@studio-design.com"
                        className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                      Phone number
                      <input
                        required
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                      Room type
                      <select
                        required
                        defaultValue=""
                        className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                      >
                        <option value="" disabled>Select room type</option>
                        <option>Living room</option>
                        <option>Bedroom</option>
                        <option>Dining room</option>
                        <option>Hotel / Office</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                      Installation timeline
                      <select
                        required
                        defaultValue=""
                        className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                      >
                        <option value="" disabled>Select timeline</option>
                        <option>Expedited · 8–12 weeks</option>
                        <option>Standard · 14–20 weeks</option>
                        <option>Future project</option>
                      </select>
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                    Estimated rug size
                    <input
                      placeholder="e.g. 3m × 4m or 10' × 13'"
                      className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                    Notes &amp; color ideas
                    <textarea
                      rows={5}
                      placeholder="Tell us about room lighting, flooring type, desired pile height, or paint codes..."
                      className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                    />
                  </label>
                  <label className="flex items-start gap-2.5 p-3.5 bg-ash text-navy text-[10px] font-bold tracking-[.1em] cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 accent-gold cursor-pointer" />
                    <span className="text-cool text-xs leading-[1.5] normal-case tracking-normal">
                      <strong className="text-navy font-bold">Send me a free sample swatch box</strong> — delivered with 8 yarn swatches matched to your colors.
                    </span>
                  </label>
                  <button
                    className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 text-white bg-navy text-[10px] font-bold tracking-[.13em] uppercase border-0 cursor-pointer hover:bg-navy/90 transition-colors"
                    type="submit"
                  >
                    Send inquiry &amp; request free swatches <Send size={15} />
                  </button>
                  <small className="text-[#8a9298] text-center text-[10px] block mt-1">
                    NDA protection: proprietary blueprints and residential client details are protected under our strict Atelier Confidentiality Covenant.
                  </small>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Trade Benefits */}
      <section className="bg-ash py-[70px] md:py-[100px] px-6 md:px-[5%]">
        <div className="max-w-[1310px] mx-auto">
          <SectionHeading
            eyebrow="CURATED ARCHITECT SERVICES"
            title="Trade benefits for designers & architects"
            text="The tools, samples, and service details that keep a considered project moving."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Free designer swatch box', 'Quick sample weaves', 'White-glove delivery'].map((benefit) => (
              <div key={benefit} className="p-[25px] bg-white border border-[#dbe1e5]">
                <div className="grid place-items-center w-[45px] h-[45px] mb-5 text-gold bg-ash">
                  <Check size={20} />
                </div>
                <span className="text-gold text-[9px] font-bold tracking-[.13em] uppercase block">
                  PRIVILEGE
                </span>
                <h3 className="my-2 text-navy font-manrope font-normal text-[23px]">
                  {benefit}
                </h3>
                <p className="text-cool text-[13px] leading-[1.7] m-0">
                  Direct support and beautifully documented material samples for your specification library.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
