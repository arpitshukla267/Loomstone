import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const whyLoomstoneSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "What Sets Loomstone Apart", trim: true },
    subheading: {
      type: String,
      default: "Thoughtful Design. Bespoke Craftmenship. Seemless Execution.",
      trim: true,
    },
    image: { type: String, default: "" },
    imageId: { type: String, default: "" },
    features: { type: [featureSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("WhyLoomstone", whyLoomstoneSchema);
