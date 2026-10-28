export interface Industry {
  slug:string,
  name:string,
  image:string,
  description:string
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "hospitality",
    name: "Hospitality",
    image: "/new-folder/Industries-we-serve/Hospitality.png",
    description:
      "Elevate hotels, resorts and dining spaces with bespoke carpets and rugs that express your brand identity, enrich guest experiences and deliver lasting performance.",
  },
  {
    slug: "corporate-commercial",
    name: "Corp & Commercial spaces",
    image: "/industries/corporate-commercial.png",
    description:
      "Create inspiring workplaces and distinctive commercial environments with versatile flooring solutions that balance contemporary design, acoustic comfort and everyday practicality.",
  },
  {
    slug: "public-institutional",
    name: "Public Spaces",
    image: "/industries/public-institutional.png",
    description:
      "Equip airports, healthcare facilities, educational institutions and public spaces with resilient flooring solutions designed for demanding environments, easy maintenance and long-term performance.",
  },
  {
    slug: "leisure-entertainment",
    name: "Leisure & Entertainment",
    image: "/industries/leisure-entertainment.png",
    description:
      "Bring distinctive character to casinos, cinemas, theatres and entertainment venues with expressive carpet designs that enhance the atmosphere and perform under heavy foot traffic.",
  },
  {
    slug: "gaming",
    name: "Gaming",
    image: "/industries/Gaming.png",
    description:
      "Enhance gaming arenas, esports venues and gaming lounges with high-performance flooring solutions that combine modern aesthetics, acoustic comfort and durability for high-traffic environments.",
  },
  {
    slug: "luxury-residential",
    name: "Luxury Residential",
    image: "/industries/Residencieal.png",
    description:
      "Transform private residences with beautifully crafted rugs, premium carpets and refined flooring solutions tailored to individual tastes, architectural details and contemporary living.",
  },
];
