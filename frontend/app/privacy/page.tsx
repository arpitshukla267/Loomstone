import Link from "next/link";
import { PageFrame } from "@/components/site/site-chrome";

export default function PrivacyPage() {
  const lastUpdated = "November 2026";

  return (
    <PageFrame active="Privacy">
      <section className="bg-[#FFFCF4] px-6 pb-20 pt-[130px] md:px-[5%] md:pb-28 md:pt-[160px]">
        <div className="mx-auto max-w-[860px] 3xl:max-w-[1040px]">
          {/* Header */}
          <div className="border-b border-line/60 pb-8 md:pb-12">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gold font-medium">
              Legal & Policies
            </span>
            <h1 className="mt-3 font-manrope text-[34px] font-normal tracking-[-0.03em] text-navy md:text-[46px] 3xl:text-[56px]">
              Privacy Policy
            </h1>
            <p className="mt-2 text-[14px] text-cool/80">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Body Content */}
          <div className="mt-10 space-y-10 text-[15px] leading-[1.8] text-slate-700 md:text-[16px] 3xl:text-[18px]">
            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                1. Our Commitment to Privacy
              </h2>
              <p>
                At Loomstone, we value your trust and are committed to protecting the confidentiality
                and security of your personal data. This Privacy Policy describes how we collect, use,
                and safeguard information when you visit our website (
                <Link href="/" className="text-navy hover:text-gold underline underline-offset-4">
                  loomstone.in
                </Link>
                ), submit an inquiry, download our brochure, or request bespoke carpet consultations.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We only collect information necessary to deliver exceptional bespoke flooring services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>
                  <strong className="text-navy font-medium">Contact Details:</strong> Your name,
                  email address, phone number, company/firm name, and country when you submit a
                  contact form, request a quote, or download our catalog.
                </li>
                <li>
                  <strong className="text-navy font-medium">Project Specifications:</strong> Details
                  regarding your interior space, carpet dimensions, fiber preferences (e.g. wool,
                  silk), timeline, and design references.
                </li>
                <li>
                  <strong className="text-navy font-medium">Technical Usage Data:</strong> Anonymized
                  browser information, device type, and page interactions to help us optimize the speed
                  and performance of our digital catalog.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">We use your information exclusively to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Respond directly to your inquiries and prepare customized design proposals.</li>
                <li>Deliver requested product brochures, technical specifications, and samples.</li>
                <li>Coordinate logistics, delivery, and installation for approved project orders.</li>
                <li>Ensure the security and reliability of our website.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                4. Data Protection & Sharing
              </h2>
              <p>
                <strong className="text-navy font-medium">We do not sell, rent, or trade your personal data.</strong>{" "}
                Your details are only shared with trusted operational partners strictly necessary to
                fulfill your requirements (such as insured courier services for physical samples and
                freight carriers for deliveries). All partners are bound by strict confidentiality
                obligations.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                5. Cookies & Analytics
              </h2>
              <p>
                We use minimal, performance-focused cookies to remember your browsing preferences and
                understand which carpet collections are most relevant to our visitors. You can adjust
                your browser settings at any time to decline cookies without affecting your access to
                our site.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-[20px] font-medium text-navy md:text-[22px] mb-3">
                6. Your Rights
              </h2>
              <p>
                You have the right to request access to any personal data we hold about you, request
                corrections, or ask for your information to be deleted from our contact records.
                To exercise any of these rights, please email us directly.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white/70 p-6 md:p-8">
              <h2 className="font-manrope text-[19px] font-medium text-navy mb-2">
                Privacy Inquiries & Data Requests
              </h2>
              <p className="text-cool mb-4">
                If you have questions about how your information is handled, contact our privacy officer:
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
