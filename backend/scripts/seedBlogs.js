import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import Blog, { generateBlogSlug } from "../models/Blog.js";

const blogsData = [
  {
    title: "Axminster vs Hand-Tufted Carpets: Which Is Right for Your Hotel?",
    slug: "axminster-vs-hand-tufted-carpets-hotel",
    summary:
      "A detailed comparison of Axminster and hand-tufted carpets covering durability, design flexibility, cost, and suitability for different hospitality zones — from grand lobbies to guest room corridors.",
    content: [
      "Choosing the right carpet for a hotel project is one of the most impactful design decisions an architect or interior designer will make. The flooring sets the tone — it defines acoustics, influences guest perception, and must endure years of heavy foot traffic without losing its visual appeal.",
      "Axminster carpets are woven on precision looms, allowing intricate multi-colour patterns with sharp definition. They are the gold standard for hotel corridors, ballrooms, and public areas where pattern complexity and durability are paramount. Modern Axminster looms can produce designs with up to 12 colours in an 80% wool / 20% nylon blend, offering excellent resilience and soil resistance.",
      "Hand-tufted carpets, on the other hand, are crafted by artisans using a tufting gun to push yarn through a backing cloth. This technique allows greater freedom in pile height variation, sculpted textures, and organic shapes — making them ideal for feature rugs in presidential suites, spa lounges, and signature restaurants.",
      "From a cost perspective, Axminster is typically more economical for large-area installations (corridors, conference halls), while hand-tufted pieces command a premium due to the labour-intensive process but deliver unmatched tactile luxury for showcase areas.",
      "At Loomstone, we help project teams select the right technique for each zone — often combining both within a single property to balance budget, aesthetics, and performance across the entire floor plan."
    ],
    date: "October 2026",
    readTime: "6 min read",
    order: 0,
  },
  {
    title: "Sustainable Flooring in Luxury Hospitality: Beyond Greenwashing",
    slug: "sustainable-flooring-luxury-hospitality",
    summary:
      "How leading hotel brands are adopting genuinely sustainable flooring — from responsibly sourced wool and natural dyes to Cradle-to-Cradle certified carpet tiles — without compromising on design or guest experience.",
    content: [
      "Sustainability is no longer a marketing checkbox for luxury hospitality brands — it is a core business imperative. Guests, investors, and certification bodies (LEED, BREEAM, IGBC) are demanding transparency in every material specification, and flooring is one of the largest surface areas in any hotel.",
      "Responsibly sourced New Zealand wool remains the most sustainable premium carpet fibre. It is renewable, biodegradable, naturally flame-retardant, and has inherent soil-resistance properties that reduce the need for chemical treatments. When paired with natural dyes derived from plants and minerals, the result is a floor covering with a genuinely low environmental footprint.",
      "Carpet tile manufacturers have made significant strides with closed-loop recycling programmes, carbon-negative backings, and take-back schemes. For commercial zones like conference centres and co-working spaces within hotels, these solutions offer the performance benefits of modular flooring with measurable sustainability credentials.",
      "Resilient flooring options — particularly phthalate-free LVT and bio-based vinyl — are gaining traction in wet areas, kitchens, and back-of-house zones where hygiene, waterproofing, and easy maintenance are non-negotiable.",
      "At Loomstone, we provide full Environmental Product Declarations (EPDs) and lifecycle assessments for every product we specify, helping our clients meet green building certification targets while delivering interiors that feel as luxurious as they look."
    ],
    date: "September 2026",
    readTime: "7 min read",
    order: 1,
  },
  {
    title: "The Role of Flooring in Hotel Acoustic Design",
    slug: "flooring-hotel-acoustic-design",
    summary:
      "Why acoustic performance should be a primary consideration in hospitality flooring specification — and how the right carpet or resilient floor can dramatically improve guest comfort and satisfaction scores.",
    content: [
      "Noise is consistently ranked among the top three guest complaints in hotel satisfaction surveys. While wall and ceiling treatments receive significant attention in acoustic planning, flooring is often the most cost-effective intervention for controlling impact noise, airborne sound, and reverberation.",
      "Carpets are inherently superior acoustic performers. A quality Axminster carpet on a suitable underlay can achieve Impact Sound Improvement (ΔLw) values of 25–35 dB, dramatically reducing footfall noise transmission between floors. In corridors — where luggage trolleys, housekeeping carts, and guest foot traffic generate constant noise — carpet remains the undisputed choice.",
      "For areas where hard-surface aesthetics are preferred — lobbies, restaurants, spa reception — resilient flooring with integrated acoustic backings offers a compelling compromise. Modern LVT products with cork or foam underlays can achieve ΔLw values of 15–19 dB while delivering the visual appeal of natural stone or timber.",
      "The specification process should begin with an understanding of the building's acoustic targets (often defined by the project's acoustic consultant or by brand standards). At Loomstone, we provide Noise Reduction Coefficient (NRC) and Impact Sound data for every product, enabling architects to make informed selections that satisfy both design vision and technical performance requirements."
    ],
    date: "August 2026",
    readTime: "5 min read",
    order: 2,
  },
  {
    title: "Designing Bespoke Carpet Patterns: From Concept to Loom",
    slug: "designing-bespoke-carpet-patterns-concept-to-loom",
    summary:
      "An inside look at how Loomstone's design studio transforms an architect's creative brief into a production-ready carpet — covering mood boards, CAD development, colour matching, sampling, and final weaving.",
    content: [
      "Every bespoke carpet begins with a story. It might be drawn from the heritage of a palace hotel, the geometry of a city skyline, or the organic forms of a coastal landscape. Our role as flooring specialists is to translate that narrative into a surface that guests walk on, sit on, and experience every day.",
      "The process starts with a detailed design brief from the architect or interior designer — typically including mood boards, material palettes, colour references (Pantone, NCS, or physical samples), and spatial plans showing where the carpet will be installed.",
      "Our design studio then develops multiple concept options, rendered in high-resolution CAD with accurate colour representation. These digital mockups are reviewed collaboratively, refined through feedback cycles, and finalised with precise technical annotations — repeat sizes, pile direction, border treatments, and seam placements.",
      "Before production, we produce physical strike-off samples — small woven sections that allow stakeholders to evaluate colour accuracy, texture, and pattern definition under the actual lighting conditions of the installation site. This step is critical; digital screens cannot replicate the way light interacts with yarn.",
      "Once approved, the design is programmed into the loom's electronic jacquard system. Production typically takes 8–12 weeks for Axminster, with multi-stage quality inspections at the mill ensuring consistency across every roll delivered to site."
    ],
    date: "July 2026",
    readTime: "8 min read",
    order: 3,
  },
  {
    title: "Flooring Trends Shaping Indian Hospitality in 2026",
    slug: "flooring-trends-indian-hospitality-2026",
    summary:
      "From biophilic design and earthy colour palettes to performance-driven resilient floors and heritage craft revival — the key flooring trends defining India's next generation of luxury hotels and resorts.",
    content: [
      "India's hospitality sector is experiencing a design renaissance. With international brands expanding into Tier-2 cities and heritage properties being reimagined for contemporary travellers, flooring choices are evolving rapidly to reflect both global trends and distinctly Indian sensibilities.",
      "Biophilic design continues to dominate — earthy tones, organic patterns, and natural materials that connect guests with nature. Carpets inspired by forest canopies, river stones, and botanical motifs are replacing the geometric precision of earlier decades. Wool and silk blends in warm terracottas, sage greens, and sandstone hues are in high demand.",
      "The revival of Indian craft traditions is another powerful trend. Architects are commissioning hand-knotted rugs featuring traditional Kashmiri, Rajasthani, and Tibetan weaving techniques, but reinterpreted through a contemporary design lens. These artisan pieces serve as centrepieces in lobby lounges and signature dining spaces.",
      "On the performance side, resilient flooring is gaining significant ground. LVT with rigid core (SPC) technology is being specified for high-traffic public areas, F&B outlets, and wellness zones, offering the aesthetic of natural materials with waterproof, scratch-resistant, and hygienic properties that carpet cannot match in these applications.",
      "At Loomstone, we are seeing a clear shift toward hybrid flooring strategies — combining bespoke woven carpets in premium guest-facing areas with high-performance resilient solutions in operational zones. This approach optimises both design impact and total cost of ownership."
    ],
    date: "November 2026",
    readTime: "6 min read",
    order: 4,
  },
];

const seed = async () => {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Neither MONGODB_URI nor MONGO_URI is defined");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await Blog.find();
  if (existing.length && !force) {
    console.log(
      `${existing.length} blog posts already exist in database. Use --force to re-seed.`
    );
    return;
  }

  if (existing.length && force) {
    console.log("--force: Removing existing blog posts...");
    await Blog.deleteMany({});
  }

  console.log(`Seeding ${blogsData.length} blog posts...`);
  for (const item of blogsData) {
    await Blog.create({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      date: item.date,
      readTime: item.readTime,
      image: "",
      imagePublicId: "",
      isPublished: true,
      order: item.order,
    });
    console.log(`  ✓ Created blog: ${item.title}`);
  }

  console.log(`All ${blogsData.length} blog posts seeded successfully!`);
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
