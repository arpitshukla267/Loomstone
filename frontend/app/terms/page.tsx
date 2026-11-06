import Link from "next/link";
import { PageFrame } from "@/components/site/site-chrome";

export default function TermsPage() {
  const lastUpdated = "November 2026";

  return (
    <PageFrame active="Terms">
      <section className="bg-[#FFFCF4] px-6 pb-20 pt-[130px] md:px-[5%] md:pb-28 md:pt-[160px]">
        <div className="mx-auto max-w-[860px] 3xl:max-w-[1040px]">
          {/* Header */}
          <div className="border-b border-line/60 pb-8 md:pb-12">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gold font-medium">
              Legal & Policies
            </span>
            <h1 className="mt-3 font-manrope text-[34px] font-normal tracking-[-0.03em] text-navy md:text-[46px] 3xl:text-[56px]">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-[14px] text-cool/80">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Body Content */}
          <div className="mt-10 space-y-10 text-[15px] leading-[1.8] text-slate-700 md:text-[16px] 3xl:text-[18px]">
            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                Welcome to Loomstone. By accessing our website (
                <Link href="/" className="text-navy hover:text-gold underline underline-offset-4">
                  loomstone.in
                </Link>
                ), requesting product catalogs, or commissioning bespoke carpets and flooring
                solutions from us, you agree to comply with and be bound by these Terms &
                Conditions. If you do not agree with any part of these terms, please refrain from
                using our services.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                2. Bespoke Manufacturing & Specifications
              </h2>
              <p className="mb-3">
                Loomstone specializes in custom handcrafted rugs, bespoke hand-tufted carpets,
                precision Axminster carpets, and architectural textile flooring.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>
                  <strong className="text-navy font-medium">Natural Variations:</strong> Because our
                  carpets are crafted using natural fibers including New Zealand wool, botanical
                  silk, and natural dyes, subtle variations in color, texture, and pile height are
                  inherent characteristics of artisanal production.
                </li>
                <li>
                  <strong className="text-navy font-medium">Samples & Strike-Offs:</strong> Project
                  strike-offs and samples are provided for aesthetic and tactile approval prior to
                  bulk production. Production begins upon written sign-off and agreed specifications.
                </li>
                <li>
                  <strong className="text-navy font-medium">Dimensional Tolerances:</strong> Hand-crafted
                  and custom-loomed carpets may have an industry-standard dimensional tolerance of up
                  to &plusmn;2%.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                3. Quotations, Inquiries & Orders
              </h2>
              <p>
                All project quotations issued via our website, email, or official representative are
                valid for the timeframe specified in the quotation (typically 30 days). Orders are
                confirmed upon execution of a formal purchase contract and receipt of the agreed
                initial production advance.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                4. Intellectual Property
              </h2>
              <p>
                All designs, photography, graphics, brand marks, and technical product documentation
                displayed on this website are the intellectual property of Loomstone or its licensors.
                Unauthorized reproduction, redistribution, or commercial use is strictly prohibited
                without prior written consent.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                5. Care & Installation
              </h2>
              <p>
                Proper underlay, site preparation, and certified installation are critical to the
                longevity and performance of premium carpets. Loomstone provides comprehensive
                maintenance and cleaning guidelines for each product category upon delivery.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                6. Governing Law
              </h2>
              <p>
                These Terms and Conditions shall be governed by and interpreted in accordance with the
                laws of India. Any disputes arising in connection with these terms shall be subject to
                the exclusive jurisdiction of the courts in Gurgaon, Haryana, India.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white/70 p-6 md:p-8">
              <h2 className="font-manrope text-[19px] font-medium text-navy mb-2">
                Have questions regarding our terms?
              </h2>
              <p className="text-cool mb-4">
                Reach out to our team directly for clarification on project terms, commercial contracts,
                or custom order requirements.
              </p>
              <div className="flex flex-wrap gap-4 text-[14px]">
                <a
                  href="mailto:office@loomstone.in"
                  className="font-medium text-navy hover:text-gold transition-colors"
                >
                  office@loomstone.in
                </a>
                <span className="text-cool/40">&bull;</span>
                <a
                  href="tel:+919916199988"
                  className="font-medium text-navy hover:text-gold transition-colors"
                >
                  +91 9916199988
                </a>
                <span className="text-cool/40">&bull;</span>
                <span className="text-cool">Gurgaon, Haryana, India</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
