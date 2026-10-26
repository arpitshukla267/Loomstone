export interface Industry {
  slug: string;
  name: string;
  image: string;
  description: string;
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "hospitality",
    name: "Hospitality",
    image: "/industries/hospitality.png",
    description:
      "Custom Axminster carpets and bespoke rugs for hotels, resorts and restaurants, crafted to match your brand and withstand constant footfall.",
  },
  {
    slug: "corporate-commercial",
    name: "Corporate & Commercial",
    image: "/industries/corporate-commercial.png",
    description:
      "Modular carpet tiles and LVT for offices and retail spaces, combining design flexibility, acoustic comfort and easy maintenance.",
  },
  {
    slug: "public-institutional",
    name: "Public & Institutional",
    image: "/industries/public-institutional.png",
    description:
      "Durable, low-maintenance flooring for airports, healthcare, education and government projects, built for performance and long service life.",
  },
  {
    slug: "leisure-entertainment",
    name: "Leisure & Entertainment",
    image: "/industries/leisure-entertainment.png",
    description:
      "Statement carpets and bespoke patterns for casinos, cinemas, theatres and venues, engineered to look striking and perform in high-traffic areas.",
  },
  {
    slug: "luxury-residential",
    name: "Luxury Residential",
    image: "/industries/luxury-residential.png",
    description:
      "Handcrafted rugs, fine broadloom and premium LVT for private residences, made to your design with exceptional quality and finish.",
  },
];
