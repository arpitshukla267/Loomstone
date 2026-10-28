"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import Image from "next/image";
type FormState = {
  name: string;
  mobile: string;
  email: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { name: "", mobile: "", email: "" };

function validate(form: FormState): Errors {
  const errors: Errors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  const digits = form.mobile.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) {
    errors.mobile = "Please enter a valid mobile number.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

export default function BrochurePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      // TODO: connect to your backend / email service here, e.g.
      // await fetch("/api/brochure", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-[4px] border bg-white px-4 py-3 text-[15px] text-navy outline-none transition-colors placeholder:text-[#9aa3ab] focus:border-gold ${
      hasError ? "border-red-400" : "border-line"
    }`;

  return (
    <PageFrame active="Brochure">
      <section className="bg-[#FFFCF4] px-6 pb-[70px] pt-[130px] md:px-[5%] md:pb-[100px] md:pt-[170px]">
        <div className="mx-auto max-w-[1100px] 3xl:max-w-[1500px] 4xl:max-w-[1800px]">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 3xl:gap-24 4xl:gap-32">
            {/* Left: copy */}
            <div>
              <div className="relative h-[48px] w-[180px] md:h-[60px] md:w-[220px]">
                <Image
                  src="/logo-vertical.png"
                  alt="Loomstone"
                  fill
                  priority
                  sizes="220px"
                  className="object-cover object-left -ml-12"
                />
              </div>
              <h1 className="mt-4 font-manrope text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[clamp(40px,5vw,56px)] 3xl:text-[62px] 4xl:text-[72px]">
                Request the{" "}
                <em className="not-italic text-gold">Loomstone Brochure</em>
              </h1>
              <p className="mt-5 max-w-[480px] 3xl:max-w-[600px] 4xl:max-w-[700px] text-[15px] leading-[1.8] text-cool md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
                Explore our bespoke carpets, textile flooring and custom
                flooring solutions for hospitality and commercial spaces. Share
                your details and we will send the brochure to you shortly.
              </p>
            </div>

            {/* Right: form */}
            <div className="rounded-[4px] border border-line bg-white p-6 shadow-[0_16px_36px_rgba(42,41,103,0.06)] md:p-9 3xl:p-14 4xl:p-16">
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 size={48} className="text-gold" />
                  <h2 className="mt-5 font-manrope text-[24px] font-semibold text-navy">
                    Thank you!
                  </h2>
                  <p className="mt-3 max-w-[340px] text-[15px] leading-[1.7] text-cool">
                    Your request has been received. We will send you the
                    brochure shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[12px] font-semibold uppercase tracking-[0.08em] text-navy underline underline-offset-4 transition-colors hover:text-gold"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h2 className="font-manrope text-[22px] font-semibold text-navy">
                      Your details
                    </h2>
                    <p className="mt-1 text-[13px] text-cool">
                      All fields are required.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-navy"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your full name"
                      className={inputClass(!!errors.name)}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-[12px] text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-navy"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.mobile}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      placeholder="Your Phone Number"
                      className={inputClass(!!errors.mobile)}
                    />
                    {errors.mobile && (
                      <p className="mt-1.5 text-[12px] text-red-500">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-navy"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Your Email"
                      className={inputClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[12px] text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[2px] border border-navy bg-navy px-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:border-gold hover:bg-gold hover:text-navy disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Request Brochure"}
                  </button>

                  <p className="text-center text-[12px] leading-[1.6] text-cool">
                    We respect your privacy. Your details are used only to share
                    the brochure and follow up on your enquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
