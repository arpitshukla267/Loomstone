"use client";

import { PageFrame } from "@/components/site/site-chrome";

const steps = [
  {
    title: "Design Consultation",
    text: "Every project begins with a deep understanding of the design narrative. Working closely with architects, interior designers, developers, and stakeholders, we align creative intent, operational requirements, technical specifications, and project objectives to establish a foundation for exceptional outcomes.",
    image: "", // e.g. "/process/consultation.jpg"
  },
  {
    title: "Bespoke Design Development",
    text: "Drawing inspiration from the project’s vision, we develop custom flooring concepts tailored in pattern, texture, colour, material, and scale. Every design is thoughtfully curated to complement the architectural language and enhance the overall spatial experience.",
    image: "",
  },
  {
    title: "Sampling & Prototyping",
    text: "Through detailed samples and bespoke prototypes, concepts are translated into tangible experiences. This process allows every element to be reviewed, refined, and perfected, ensuring complete confidence before production begins.",
    image: "",
  },
  {
    title: "Technical & Value Engineering",
    text: "Our expertise ensures that aesthetic aspirations are seamlessly balanced with durability, functionality, specification requirements, and commercial considerations. The result is a flooring solution that delivers both visual impact and long-term performance without compromise.",
    image: "",
  },
  {
    title: "Production & Project Coordination",
    text: "We oversee every stage of production, quality assurance, logistics, and project coordination. Our disciplined approach ensures exceptional craftsmanship, consistency, and reliable delivery at every stage.",
    image: "",
  },
  {
    title: "Installation & Continued Support",
    text: "Our commitment extends beyond delivery. From installation guidance and site coordination to ongoing support, we remain an engaged partner throughout the lifecycle of the project, ensuring enduring quality, performance, and client satisfaction.",
    image: "",
  },
];

export default function ProjectsPage() {
  return (
    <PageFrame active="Projects">
      <div className="bg-[#FFFCF4]">
        {/* Hero with background image */}
        <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden px-6 pt-[130px] pb-[60px] md:min-h-[560px] md:px-[5%] md:pt-[170px] md:pb-[90px]">
          <img
            src="/design-project.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center text-center">
            <h1 className="font-manrope text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[clamp(42px,5.5vw,68px)]">
              From Vision to{" "}
              <em className="not-italic text-gold">Exceptional Spaces</em>
            </h1>
          </div>
        </section>

        {/* Process */}
        <section className="px-6 py-[70px] md:px-[5%] md:py-[100px]">
          <div className="mx-auto flex max-w-[1310px] flex-col gap-10 md:gap-14 lg:gap-20">
            {steps.map((step, index) => {
              const mediaOnLeft = index % 2 === 0;
              return (
                <div
                  key={step.title}
                  className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
                >
                  <div
                    className={`relative aspect-[16/10] w-full overflow-hidden bg-[#dbe1e5] ${
                      mediaOnLeft ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {step.image && (
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div
                    className={`flex flex-col items-center px-2 text-center ${
                      mediaOnLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <h3 className="font-manrope text-[28px] font-normal leading-[1.2] text-navy sm:text-[34px] lg:text-[40px]">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[620px] text-[15px] leading-[1.75] text-cool sm:text-[17px] lg:text-[18px]">
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Approach */}
        <section className="mb-[70px] w-full md:mb-[110px]">
          {/* Same ratio as the actual image (1352 x 506) so nothing is cropped */}
          <div className="relative aspect-[1352/560] w-full overflow-hidden">
            <img
              src="/approach.png"
              alt="Hospitality, commercial and residential flooring environments"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Content on the empty right side (desktop) */}
            <div className="absolute inset-y-0 right-0 hidden w-[40%] items-center justify-end pr-[4%] lg:flex">
              {" "}
              <div className="flex max-w-[530px] flex-col items-start">
                <h2 className="font-manrope text-[clamp(26px,2.8vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-navy">
                  Our <em className="not-italic text-gold">Approach</em>
                </h2>

                <div className="mt-3 space-y-2.5 font-manrope text-[13px] font-normal leading-[1.6] text-navy xl:mt-4 xl:space-y-3 xl:text-[15px] xl:leading-[1.7] 2xl:text-base">
                  <p>
                    From luxury hospitality destinations and signature
                    commercial developments to bespoke residential environments,
                    Loomstone delivers flooring solutions that seamlessly unite
                    design excellence, craftsmanship, technical precision, and
                    enduring value.
                  </p>
                  <p>
                    We work with design teams, developers, and project owners
                    across international markets, adapting every collection to
                    local design sensibilities, regional specification
                    standards, and the performance demands of each environment.
                  </p>
                  <p className="hidden xl:block">
                    From the first concept sketch to final installation, one
                    dedicated team manages design, sampling, production, and
                    logistics, so projects stay aligned to vision, budget, and
                    schedule, wherever they are in the world.
                  </p>
                </div>

                <p className="mt-4 hidden border-t border-gold/60 pt-3 text-[11px] font-semibold uppercase tracking-[.12em] text-navy/70 2xl:block">
                  Hospitality &bull; Commercial &bull; Residential &bull; Global
                  Projects
                </p>
              </div>
            </div>
          </div>

          {/* Content below the image (mobile / tablet) */}
          <div className="px-6 pt-8 md:px-[5%] lg:hidden">
            <h2 className="font-manrope text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[40px]">
              Our <em className="not-italic text-gold">Approach</em>
            </h2>
            <div className="mt-4 space-y-4 font-manrope text-base leading-[1.75] text-navy">
              <p>
                From luxury hospitality destinations and signature commercial
                developments to bespoke residential environments, Loomstone
                delivers flooring solutions that seamlessly unite design
                excellence, craftsmanship, technical precision, and enduring
                value.
              </p>
              <p>
                We work with design teams, developers, and project owners across
                international markets, adapting every collection to local design
                sensibilities, regional specification standards, and the
                performance demands of each environment.
              </p>
              <p>
                From the first concept sketch to final installation, one
                dedicated team manages design, sampling, production, and
                logistics, so projects stay aligned to vision, budget, and
                schedule, wherever they are in the world.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
