"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { useContactInfo, waHref } from "@/lib/contact-info";

/* ---------- shared styles (our theme: navy / gold / cool / ink / line) ---------- */
const labelCls =
  "flex flex-col text-[13px] font-medium tracking-[.06em] text-navy 3xl:text-[15px] 4xl:text-[17px]";
const lineCls =
  "w-full bg-transparent border-0 border-b border-line pt-3 pb-3.5 text-[15px] text-ink outline-none placeholder:text-[#8a9298] focus:border-gold transition-colors 3xl:text-[17px] 3xl:pt-4 3xl:pb-4 4xl:text-[19px]";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <span className="mb-2.5 3xl:mb-3">
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
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-navy 3xl:h-5 3xl:w-5"
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
      <div className="text-[14px] text-cool 3xl:text-[16px] 4xl:text-[18px]">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          className="mt-1 block text-[17px] text-navy no-underline transition-colors hover:text-gold 3xl:text-[20px] 4xl:text-[23px]"
        >
          {value}
        </a>
      ) : (
        <div className="mt-1 text-[17px] text-navy 3xl:text-[20px] 4xl:text-[23px]">
          {value}
        </div>
      )}
      {sub && (
        <div className="mt-1 text-[14px] text-[#8a9298] 3xl:text-[16px] 4xl:text-[18px]">
          {sub}
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const info = useContactInfo();

  return (
    <PageFrame active="Contact">
      <div className="bg-[#FFFCF4]">
        <section className="mx-auto max-w-[1310px] px-6 pt-[130px] pb-12 md:px-[5%] md:pt-[170px] md:pb-16 min-[1350px]:px-0 3xl:max-w-[1700px] 3xl:pb-24 4xl:max-w-[2100px] 4xl:pb-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-[60px] 3xl:gap-[100px] 4xl:gap-[140px]">
            {/* ---------------- LEFT ---------------- */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-manrope text-[44px] font-medium leading-[1.05] tracking-[-0.03em] text-navy md:text-[60px] 3xl:text-[72px] 4xl:text-[84px]">
                  Get in touch /{" "}
                  <em className="text-gold not-italic">
                    start a custom order.
                  </em>
                </h1>
                <p className="mt-9 max-w-[570px] text-[17px] leading-[1.95] text-cool 3xl:max-w-[700px] 3xl:text-[20px] 4xl:max-w-[820px] 4xl:text-[23px]">
                  Connect with our design team. From choosing your rug size and
                  color to handweaving and delivery, we work closely with
                  homeowners, interior designers, and architects.
                </p>
              </div>

              <div className="mt-16 border-t border-line pt-9 lg:mt-0 3xl:pt-12">
                <div className="flex flex-col gap-8 3xl:gap-10">
                  {info.email && (
                    <Detail
                      label="Email inquiries"
                      value={info.email}
                      href={`mailto:${info.email}`}
                    />
                  )}
                  {info.phone && (
                    <Detail
                      label="WhatsApp / Phone"
                      value={info.phone}
                      href={waHref(info.phone)}
                    />
                  )}
                  {(info.responseTime || info.workshopLocation) && (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 3xl:gap-10">
                      {info.responseTime && (
                        <Detail
                          label="Quick response"
                          value={info.responseTime}
                          sub={info.responseNote || undefined}
                        />
                      )}
                      {info.workshopLocation && (
                        <Detail
                          label="Workshop Address:"
                          value={info.workshopLocation}
                          sub={info.workshopNote || undefined}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ---------------- RIGHT: FORM ---------------- */}
            <div className="border border-line px-6 py-10 md:px-[50px] md:py-[52px] 3xl:px-[64px] 3xl:py-[64px] 4xl:px-[80px] 4xl:py-[80px]">
              {sent ? (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-gold text-gold 3xl:h-16 3xl:w-16">
                    <Check size={24} />
                  </div>
                  <h2 className="font-manrope text-[30px] font-normal tracking-[-0.02em] text-navy 3xl:text-[36px] 4xl:text-[42px]">
                    Commission dossier logged.
                  </h2>
                  <p className="mx-auto mt-4 max-w-[450px] text-[15px] leading-[1.8] text-cool 3xl:max-w-[560px] 3xl:text-[17px] 4xl:text-[19px]">
                    Your specifications have been assigned to an Atelier Terroir
                    textile engineer. We will be in touch within 12 business
                    hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 border border-navy px-7 py-4 text-[13px] font-medium tracking-[.2em] text-navy uppercase transition-colors hover:bg-navy hover:text-white 3xl:text-[15px]"
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
                  <div className="grid grid-cols-1 gap-x-[40px] gap-y-8 md:grid-cols-2 3xl:gap-x-[56px] 3xl:gap-y-11">
                    <Input
                      label="Full name"
                      placeholder="Your Full Name"
                      required
                    />
                    <Input
                      label="Company or residence"
                      placeholder="Company or Residence Name"
                    />
                    <Input
                      label="Email address"
                      placeholder="Your Email Address"
                      type="email"
                      required
                    />
                    <Input
                      label="Phone number"
                      placeholder="Your Phone Number"
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

                  <div className="mt-8 3xl:mt-11">
                    <Input label="Estimated rug size" placeholder="" />
                  </div>

                  <label className={`${labelCls} mt-8 3xl:mt-11`}>
                    <Label text="Description" />
                    <textarea
                      rows={3}
                      placeholder=""
                      className={`${lineCls} resize-none pb-12 text-[16px] leading-[1.5] 3xl:text-[18px] 4xl:text-[20px]`}
                    />
                  </label>

                  <div className="mt-11 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[60px] 3xl:mt-14">
                    <button
                      type="submit"
                      className="title inline-flex shrink-0 items-center gap-3 rounded-[8px] border border-navy px-4 py-4 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white md:px-9 md:tracking-[.1em] 3xl:px-11 3xl:py-5 3xl:text-base 4xl:px-12 4xl:py-6 4xl:text-lg"
                    >
                      Send inquiry &amp; request swatches{" "}
                      <ArrowRight size={18} />
                    </button>
                    <p className="max-w-[400px] text-[12.5px] leading-[1.6] text-cool 3xl:max-w-[500px] 3xl:text-[14px] 4xl:max-w-[560px] 4xl:text-[16px]">
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
