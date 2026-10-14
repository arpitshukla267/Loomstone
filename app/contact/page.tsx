"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";

/* ---------- shared styles (our theme: navy / gold / ash / cool / ink / line) ---------- */
const labelCls =
  "flex flex-col text-[13px] font-medium tracking-[.06em] text-navy";
const lineCls =
  "w-full bg-transparent border-0 border-b border-line pt-3 pb-3.5 text-[15px] text-ink outline-none placeholder:text-[#8a9298] focus:border-gold transition-colors";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <span className="mb-2.5">
      {text}
      {required && <span className="ml-1">*</span>}
    </span>
  );
}

function Input({
  label,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className={labelCls}>
      <Label text={label} required={required} />
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        className={lineCls}
      />
    </label>
  );
}

function Select({
  label,
  placeholder,
  options,
  required,
}: {
  label: string;
  placeholder: string;
  options: string[];
  required?: boolean;
}) {
  const [value, setValue] = useState("");
  return (
    <label className={labelCls}>
      <Label text={label} required={required} />
      <div className="relative">
        <select
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${lineCls} appearance-none cursor-pointer pr-8 pt-5 ${value ? "" : "text-[#8a9298]"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-navy"
        />
      </div>
    </label>
  );
}

function Detail({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  return (
    <div>
      <div className="text-[14px] text-cool">{label}</div>
      {href ? (
        <a
          href={href}
          className="mt-1 block text-[17px] text-navy no-underline hover:text-gold transition-colors"
        >
          {value}
        </a>
      ) : (
        <div className="mt-1 text-[17px] text-navy">{value}</div>
      )}
      {sub && <div className="mt-1 text-[14px] text-[#8a9298]">{sub}</div>}
    </div>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageFrame active="Contact">
      <div className="bg-ash">
        <section className="mx-auto max-w-[1920px] px-6 pt-[130px] pb-12 md:pt-[170px] md:pb-16 lg:px-[7.4%] lg:pr-[1.5%]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-[80px]">
            {/* ---------------- LEFT ---------------- */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="mt-8 font-manrope text-[44px] font-medium leading-[1.05] tracking-[-0.03em] text-navy md:text-[60px]">
                  Get in touch /{" "}
                  <em className="text-gold not-italic">
                    start a custom order.
                  </em>
                </h1>
                <p className="mt-9 max-w-[570px] text-[17px] leading-[1.95] text-cool">
                  Connect with our design team. From choosing your rug size and
                  color to handweaving and delivery, we work closely with
                  homeowners, interior designers, and architects.
                </p>
              </div>

              <div className="mt-16 border-t border-line pt-9 lg:mt-0">
                <div className="flex flex-col gap-8">
                  <Detail
                    label="Email inquiries"
                    value="hello@atelierterroir.com"
                    href="mailto:hello@atelierterroir.com"
                  />
                  <Detail
                    label="WhatsApp / Phone"
                    value="+33 1 40 50 20 10"
                    href="https://wa.me/33140502010"
                  />
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <Detail
                      label="Quick response"
                      value="Within 12 hours"
                      sub="Showroom visits by appointment"
                    />
                    <Detail
                      label="Atelier Workshops"
                      value="Jaipur, India"
                      sub="Amber Road Craft Enclave"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- RIGHT: FORM ---------------- */}
            <div className="border border-line px-6 py-10 md:px-[50px] md:py-[52px]">
              {sent ? (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-gold text-gold">
                    <Check size={24} />
                  </div>
                  <h2 className="font-manrope text-[30px] font-normal tracking-[-0.02em] text-navy">
                    Commission dossier logged.
                  </h2>
                  <p className="mx-auto mt-4 max-w-[450px] text-[15px] leading-[1.8] text-cool">
                    Your specifications have been assigned to an Atelier Terroir
                    textile engineer. We will be in touch within 12 business
                    hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 border border-navy px-7 py-4 text-[13px] font-medium tracking-[.2em] text-navy uppercase transition-colors hover:bg-navy hover:text-white"
                  >
                    Start another inquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="flex flex-col"
                >
                  <div className="grid grid-cols-1 gap-x-[40px] gap-y-8 md:grid-cols-2">
                    <Input
                      label="Full name"
                      placeholder="e.g. Jean-Michel Moreau"
                      required
                    />
                    <Input
                      label="Company or residence"
                      placeholder="e.g. Moreau Architecture Studio"
                    />
                    <Input
                      label="Email address"
                      placeholder="j.moreau@studio-design.com"
                      type="email"
                      required
                    />
                    <Input
                      label="Phone number"
                      placeholder="+33 6 12 34 56 78"
                      type="tel"
                      required
                    />
                    <Select
                      label="Room type"
                      placeholder="Select room type"
                      options={[
                        "Living room",
                        "Bedroom",
                        "Dining room",
                        "Hotel / Office",
                      ]}
                      required
                    />
                    <Select
                      label="Installation timeline"
                      placeholder="Select timeline"
                      options={[
                        "Expedited · 8–12 weeks",
                        "Standard · 14–20 weeks",
                        "Future project",
                      ]}
                      required
                    />
                  </div>

                  <div className="mt-8">
                    <Input
                      label="Estimated rug size"
                      placeholder="e.g. 3m × 4m or 10' × 13'"
                    />
                  </div>

                  <label className={`${labelCls} mt-8`}>
                    <Label text="Notes & color ideas" />
                    <textarea
                      rows={3}
                      placeholder="Tell us about room lighting, flooring type, desired pile height, or paint codes..."
                      className={`${lineCls} resize-none pb-12 text-[16px] leading-[1.5]`}
                    />
                  </label>

                  <label className="mt-8 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 cursor-pointer accent-gold"
                    />
                    <span className="text-[13px] leading-[1.6] text-cool">
                      <strong className="font-bold text-navy">
                        Send me a free sample swatch box
                      </strong>{" "}
                      — delivered with 8 yarn swatches matched to your colors.
                    </span>
                  </label>

                  <div className="mt-11 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[60px]">
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center gap-3 border border-navy px-9 py-[21px] text-[13px] font-medium tracking-[.2em] text-navy uppercase transition-colors hover:bg-navy hover:text-white"
                    >
                      Send inquiry &amp; request swatches{" "}
                      <ArrowRight size={18} />
                    </button>
                    <p className="max-w-[400px] text-[12.5px] leading-[1.6] text-cool">
                      NDA protection: proprietary blueprints and residential
                      client details are protected under our strict Atelier
                      Confidentiality Covenant.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
