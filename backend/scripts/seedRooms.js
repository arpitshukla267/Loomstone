import "dotenv/config";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Room from "../models/rooms.js";

const CLOUDINARY_FOLDER = "loomstone";

const buildHref = (name) =>
  `/products?room=${encodeURIComponent(name).replace(/%20/g, "+")}`;

const roomsData = [
  {
    name: "Living Room",
    heading: "Living Room",
    desc: "Statement centerpieces designed for seating arrangements & conversation.",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    slug: "room-living-room",
    order: 0,
  },
  {
    name: "Bedroom",
    heading: "Bedroom",
    desc: "Serene, tactile luxury providing acoustic warmth and soft morning steps.",
    imageUrl:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
    slug: "room-bedroom",
    order: 1,
  },
  {
    name: "Dining Room",
    heading: "Dining Room",
    desc: "Hard-wearing handlooms, low piles and axminsters allowing effortless chair gliding.",
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    slug: "room-dining-room",
    order: 2,
  },
  {
    name: "Hallway & Entryway",
    heading: "Hallway & Entryway",
    desc: "Durable gallery runners welcoming guests and softening circulation zones.",
    imageUrl:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    slug: "room-hallway-entryway",
    order: 3,
  },
];

const uploadToCloudinary = async (imageUrl, publicIdSuffix) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicIdSuffix,
    overwrite: true,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const seed = async () => {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Neither MONGODB_URI nor MONGO_URI is defined");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await Room.find();
  if (existing.length && !force) {
    console.log(
      `${existing.length} rooms already exist. Use --force to re-seed: npm run seed:rooms -- --force`,
    );
    return;
  }

  if (existing.length && force) {
    console.log("--force: Removing existing rooms and their Cloudinary images...");
    for (const r of existing) {
      if (r.imageId) {
        try {
          await cloudinary.uploader.destroy(r.imageId);
        } catch (e) {
          console.warn(`Failed to delete Cloudinary image ${r.imageId}:`, e.message);
        }
      }
    }
    await Room.deleteMany({});
  }

  console.log(`Seeding ${roomsData.length} rooms...`);
  for (const item of roomsData) {
    console.log(`Uploading image for "${item.name}" to Cloudinary folder "${CLOUDINARY_FOLDER}"...`);
    const { url, publicId } = await uploadToCloudinary(item.imageUrl, item.slug);

    await Room.create({
      name: item.name,
      heading: item.heading,
      desc: item.desc,
      image: url,
      imageId: publicId,
      href: buildHref(item.name),
      order: item.order,
      isActive: true,
    });
    console.log(`  ✓ Created room: ${item.name} -> ${url}`);
  }

  console.log("Rooms seeding completed successfully!");
};

seed()
  .catch((err) => {
    console.error("Room seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
