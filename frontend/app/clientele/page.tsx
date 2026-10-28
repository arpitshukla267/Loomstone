"use client";

import { PageFrame } from "@/components/site/site-chrome";

const clients = [
    { name: "Leela", logo: "/clients/leela.webp" },
    { name: "Marriott Hotels", logo: "/clients/marriott.webp" },
    { name: "ITC Hotels", logo: "/clients/itc.svg" },
    { name: "Hilton Hotels & Resorts", logo: "/clients/hilton.webp" },
    { name: "Hyatt Regancy", logo: "/clients/hyatt.png" },
    { name: "DLF Hospitality", logo: "/clients/dlf.webp" },
    { name: "FCML India", logo: "/clients/fcml.png" },
    { name: "Airtel", logo: "/clients/airtel.webp"}
//   { name: "The Executive Centre", logo: "/clients/tec.jpeg" },
];

export default function ClientelePage() {
  return (
    <PageFrame active="Clientele">
      
      {/* Trusted By */}
      <section className="bg-[#FFFCF4] pb-[70px] pt-[130px] md:pb-[100px] md:pt-[170px]">
        <div className="mx-auto max-w-[1310px] 3xl:max-w-[1700px] 4xl:max-w-[2100px] px-6 md:px-[5%] xl:px-0">
          <h1 className="font-manrope text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[clamp(40px,5vw,60px)] 3xl:text-[66px] 4xl:text-[76px]">
            Built on Expertise.{" "}
            <em className="not-italic text-gold">Defined by Trust.</em>
          </h1>

          <p className="mt-5 max-w-[820px] 3xl:max-w-[1000px] 4xl:max-w-[1200px] text-[15px] leading-[1.8] text-cool md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
            Loomstone collaborates with architects, interior designers,
            developers, hospitality groups and project consultants to deliver
            tailored flooring solutions for diverse architectural and commercial
            environments.
          </p>

          <p className="mt-4 max-w-[820px] 3xl:max-w-[1000px] 4xl:max-w-[1200px] text-[15px] leading-[1.8] text-cool md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
            Our approach is built on thoughtful design collaboration, careful
            attention to quality and dependable project coordination. By
            aligning every solution with the project's vision, specifications
            and practical requirements, we help bring ambitious spaces to life
            with confidence.
          </p>

          <p className="mt-5 font-manrope text-[18px] font-semibold text-navy md:text-[20px] 3xl:text-[24px] 4xl:text-[28px]">
            Thoughtful Collaboration. Lasting Partnerships.
          </p>
        </div>

        <div className="mt-12 border-t border-line" />
        <div className="mx-auto max-w-[85vw] 3xl:max-w-[1700px] 4xl:max-w-[2100px] px-6 py-12 md:px-[5%] md:py-16 3xl:py-20 xl:px-0">
          <div className="grid grid-cols-2 gap-4 md:gap-x-12 md:gap-y-10 lg:grid-cols-4 3xl:gap-x-16 3xl:gap-y-14">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex h-[200px] flex-col items-center justify-between rounded-[20px] border border-line bg-white px-5 py-8 md:h-[260px] 3xl:h-[300px] 4xl:h-[340px]"
              >
                <div className="flex w-full flex-1 items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-[70px] w-auto max-w-[75%] object-contain md:max-h-[90px] 3xl:max-h-[110px] 4xl:max-h-[130px]"
                  />
                </div>
                <span className="mt-4 text-center text-[13px] font-medium text-navy md:text-[15px] 3xl:text-[17px] 4xl:text-[19px]">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
