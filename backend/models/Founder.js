import mongoose from "mongoose";

const founderSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      default: "Meet Our Visionary",
      trim: true,
    },
    founderName: {
      type: String,
      default: "Pawan Yadav",
      trim: true,
    },
    designation: {
      type: String,
      default: "Managing Partner at Loomstone",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Perfection is the foundation beneath every great space.",
      trim: true,
    },
    quote: {
      type: String,
      default:
        "We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space.",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Founder", founderSchema);
