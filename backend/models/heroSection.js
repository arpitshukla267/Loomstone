import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    primaryText: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryText: {
      type: String,
      required: false,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("HeroSection", heroSectionSchema);
