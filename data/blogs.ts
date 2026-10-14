export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "the-ancient-rhythm-of-hand-knotted-looms",
    title: "The Ancient Rhythm of Hand-Knotted Looms",
    date: "October 12, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80",
    summary: "How master weavers pass down generational knot counts, preserving the organic geometry of traditional wool.",
    content: [
      "In our partner ateliers across northern India and Kashmir, the rhythm of the wooden loom begins long before daybreak. It is an ambient percussion of metal reeds and wooden combs, echoing a technique that has changed remarkably little over six centuries.",
      "A genuine hand-knotted rug is not merely a floor covering; it is an architectural tapestry constructed knot by knot. Each strand of hand-spun yarn is wrapped around adjacent warp threads, pulled taut, and carefully sheared by eye and hand. In a dense 140-knot weave, a single craftsman ties over eight thousand individual knots each day.",
      "What distinguishes this craft from modern machine manufacturing is the subtle organic irregularity known as 'abrash'. Because the yarn is spun by hand and dyed in small kettles, micro-variations in tone create a luminous, living surface. Light moves across the rug as the sun traverses a room, giving the space an enduring sense of calm and permanence.",
      "When cared for thoughtfully, a hand-knotted rug does not deteriorate with use. It softens, burnishes, and gains character, carrying the quiet stories of its makers into the homes of future generations."
    ],
  },
  {
    slug: "living-with-natural-fibers-wool-and-silk",
    title: "Living with Natural Fibers: Wool and Silk",
    date: "September 28, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
    summary: "Exploring the tactile warmth and innate resilience that pure New Zealand wool and raw silk bring into modern living spaces.",
    content: [
      "Natural fibers possess an innate intelligence that synthetic filaments cannot replicate. When unbleached wool is sheared from high-altitude flocks, it carries natural lanolin that repels spills and keeps dust on the fiber surface rather than absorbing it.",
      "In contemporary residential spaces dominated by glass, concrete, and polished timber, natural wool serves an acoustic purpose as well. It softens hard reverberations, creating an intimate soundscape where conversation feels effortless and grounded.",
      "When combined with Mulberry silk or lustrous bamboo fibers, the tactile quality shifts entirely. The silk highlights catch directional morning light, adding subtle shimmer to sculptural reliefs without overwhelming the simplicity of a room.",
      "Choosing natural fibers is ultimately a commitment to longevity. Rather than replacing carpets every few years, an honest natural rug breathes, regulates ambient humidity, and ages with quiet dignity."
    ],
  },
  {
    slug: "scale-and-proportion-in-considered-rooms",
    title: "Scale and Proportion in Considered Rooms",
    date: "September 14, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    summary: "Architectural guidelines for anchoring seating zones, open layouts, and circulation pathways.",
    content: [
      "One of the most frequent oversights in spatial design is under-scaling a floor covering. A rug that floats in the center of a living room without touching the surrounding furniture makes the room feel fragmented and adrift.",
      "An appropriately scaled rug acts as an architectural boundary. In an open-plan residence, it defines the seating enclave without requiring physical partitions. Ideally, all front legs of sofas and lounge chairs should rest comfortably on the rug, binding the seating elements into a unified conversation zone.",
      "For dining areas, generous proportions are essential. The rug should extend at least twenty-four inches beyond the tabletop on all sides. This allows guests to pull chairs out smoothly without catching legs on the edge of the weave.",
      "In corridors and gallery hallways, runners should frame the walkway rather than wall-to-wall coverage, leaving three to five inches of finished flooring visible on either side to respect the room's geometry."
    ],
  },
  {
    slug: "botanical-dyes-and-earthy-patinas",
    title: "Botanical Dyes: From Madder Root to Wild Indigo",
    date: "August 30, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1200&q=80",
    summary: "The quiet depth of plant-based pigments that evolve with natural sunlight rather than fading away.",
    content: [
      "Unlike synthetic chemical pigments that provide flat, uniform saturation, botanical dyes are harvested from roots, leaves, bark, and dried flower petals. Wild pomegranate rind yields warm golden ochres; madder roots produce deep terracotta crimsons; fermented indigo leaves grant timeless deep blues.",
      "Because natural dye molecules bond irregularly with wool cuticles, they possess extraordinary optical depth. As daylight shifts through an interior, the colors subtly adapt, appearing warm and golden at sunrise and deep and grounded by twilight.",
      "Chemical dyes often bleach and look exhausted when exposed to prolonged sunlight. In contrast, vegetable-dyed wool undergoes a process of graceful oxidation. Over twenty or thirty years, the pigments mellow into a soft, antique patina that looks richer with age.",
      "Working with plant dyes demands patience and seasonality. It reminds us that luxury is not about immediate speed, but about an unhurried dialogue between nature and human hands."
    ],
  },
];

export function getAllBlogs(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((b) => b.slug === slug);
}
