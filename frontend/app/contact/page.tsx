"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { useContactInfo, waHref } from "@/lib/contact-info";

/* ---------- shared styles (our theme: navy / gold / cool / ink / line) ---------- */
const labelCls =
  "flex flex-col text-[13px] font-medium tracking-[.06em] text-navy 3xl:text-[15px] 4xl:text-[17px]";
const lineCls =
  "w-full bg-transparent border-0 border-b border-line pt-3 pb-3.5 text-[15px] text-ink outline-none placeholder:text-[#8a9298] focus:border-gold transition-colors disabled:opacity-60 3xl:text-[17px] 3xl:pt-4 3xl:pb-4 4xl:text-[19px]";

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
  value,
  name,
  disabled,
  onChange,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  value?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={labelCls}>
      <Label text={label} required={required} />
      <input
        name={name}
        required={required}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={lineCls}
      />
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
    <div className="min-w-0">
      <div className="text-[14px] text-cool 3xl:text-[16px] 4xl:text-[18px]">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          className="mt-1 block break-words text-[17px] text-navy no-underline transition-colors hover:text-gold 3xl:text-[20px] 4xl:text-[23px]"
        >
          {value}
        </a>
      ) : (
        <div className="mt-1 break-words text-[17px] text-navy 3xl:text-[20px] 4xl:text-[23px]">
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

interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  product: string;
  requirements: string;
}

const initialForm: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  product: "",
  requirements: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const info = useContactInfo();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to submit inquiry. Please try again.");
      }

      setSent(true);
      setForm(initialForm);
    } catch (err: any) {
      setError(err?.message || "An error occurred while sending your enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageFrame active="Contact">
      <div className="bg-[#FFFCF4]">
        <section className="mx-auto max-w-[1310px] px-6 pt-[130px] pb-12 md:px-[5%] md:pt-[170px] md:pb-16 min-[1350px]:px-0 3xl:max-w-[1700px] 3xl:pb-24 4xl:max-w-[2100px] 4xl:pb-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1.2fr] lg:gap-[60px] 3xl:gap-[100px] 4xl:gap-[140px]">
            {/* ---------------- LEFT ---------------- */}
            <div className="flex flex-col justify-between gap-12">
              <div>
                <h1 className="font-manrope text-[44px] font-medium leading-[1.05] tracking-[-0.03em] text-navy md:text-[60px] 3xl:text-[72px] 4xl:text-[84px]">
                  Let's create something{" "}
                  <em className="text-gold not-italic">exceptional together</em>
                </h1>
                <p className="mt-9 max-w-[570px] text-[17px] leading-[1.95] text-cool 3xl:max-w-[700px] 3xl:text-[20px] 4xl:max-w-[820px] 4xl:text-[23px]">
                  Share your vision with us, from bespoke carpets to distinctive
                  flooring solutions. Let's collaborate to create inspiring
                  spaces defined by design, craftsmanship, and quality.{" "}
                </p>
              </div>

              <div className="mt-16 border-t border-line pt-9 lg:mt-12 3xl:pt-12">
                {/* 2-2 grid: Email + Phone, then Quick response + Sales Office */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 3xl:gap-10">
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
                  {info.responseTime && (
                    <Detail
                      label="Quick response"
                      value={info.responseTime}
                      sub={info.responseNote || undefined}
                    />
                  )}
                  {info.workshopLocation && (
                    <Detail
                      label="Sales Office:"
                      value={info.workshopLocation}
                      sub={info.workshopNote || undefined}
                    />
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
                    Your enquiry has been sent successfully!
                  </h2>
                  <p className="mx-auto mt-4 max-w-[450px] text-[15px] leading-[1.8] text-cool 3xl:max-w-[560px] 3xl:text-[17px] 4xl:text-[19px]">
                    We appreciate your interest in our products. Our team will review your enquiry and get back to you as soon as possible. Thank you for reaching out to us!
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setError(null);
                    }}
                    className="mt-8 border border-navy px-7 py-4 text-[13px] font-medium tracking-[.2em] text-navy uppercase transition-colors hover:bg-navy hover:text-white 3xl:text-[15px]"
                  >
                    Start another inquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col"
                >
                  {error && (
                    <div className="mb-6 rounded-[4px] border border-red-300 bg-red-50 p-4 text-[14px] text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Name, number, email, product */}
                  <div className="grid grid-cols-1 gap-x-[40px] gap-y-8 md:grid-cols-2 3xl:gap-x-[56px] 3xl:gap-y-11">
                    <Input
                      label="Full name"
                      name="name"
                      placeholder="Your Full Name"
                      value={form.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      required
                    />
                    <Input
                      label="Phone number"
                      name="phone"
                      placeholder="Your Phone Number"
                      type="tel"
                      value={form.phone}
                      onChange={handleInputChange}
                      disabled={submitting}
                      required
                    />
                    <Input
                      label="Email address"
                      name="email"
                      placeholder="Your Email Address"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      required
                    />
                    <Input
                      label="Product of interest"
                      name="product"
                      placeholder="Product you are interested in"
                      value={form.product}
                      onChange={handleInputChange}
                      disabled={submitting}
                    />
                  </div>

                  {/* Description */}
                  <label className={`${labelCls} mt-8 3xl:mt-11`}>
                    <Label text="Requirements" />
                    <textarea
                      name="requirements"
                      rows={3}
                      value={form.requirements}
                      onChange={handleInputChange}
                      disabled={submitting}
                      placeholder="Tell us about your spatial concept, dimensions, or design requirements..."
                      className={`${lineCls} resize-none pb-12 text-[16px] leading-[1.5] 3xl:text-[18px] 4xl:text-[20px]`}
                    />
                  </label>

                  <div className="mt-11 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[60px] 3xl:mt-14">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="title inline-flex shrink-0 items-center gap-3 rounded-[8px] border border-navy px-4 py-4 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-60 md:px-9 md:tracking-[.1em] 3xl:px-11 3xl:py-5 3xl:text-base 4xl:px-12 4xl:py-6 4xl:text-lg"
                    >
                      {submitting ? (
                        <>
                          Sending Enquiry...
                          <Loader2 size={18} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Send Enquiry &amp; request samples{" "}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
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
