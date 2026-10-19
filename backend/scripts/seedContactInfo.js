import "dotenv/config";
import mongoose from "mongoose";
import ContactInfo from "../models/ContactInfo.js";

const contactData = {
  email: "office@loomstone.in",
  phone: "+91 9916199988",
  address: "Gurgaon, India",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  x: "https://x.com",
  responseTime: "Within 12 hours",
  responseNote: "Showroom visits by appointment",
  workshopLocation: "Jaipur, India",
  workshopNote: "Amber Road Craft Enclave",
};

const seed = async () => {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Neither MONGODB_URI nor MONGO_URI is defined");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await ContactInfo.findOne();

  if (existing && !force) {
    console.log(
      "Contact info already exists. To overwrite it with the default values, run with --force",
    );
    return;
  }

  if (existing) {
    console.log("Overwriting existing contact info...");
    await ContactInfo.deleteMany({});
  }

  await ContactInfo.create(contactData);
  console.log("Contact info seeded successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
