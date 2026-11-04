import mongoose from "mongoose";

export const generateIndustrySlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const industryCardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, index: true },
    image: { type: String, required: true },
    imageId: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

export const IndustryCard = mongoose.model("IndustryCard", industryCardSchema);

const industrySectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Industries We Serve",
      trim: true,
    },
    description: {
      type: String,
      default:
        "From iconic hospitality destinations to refined commercial spaces and residences, we create bespoke flooring that brings design vision to life.",
      trim: true,
    },
    eyebrow: {
      type: String,
      default: "Global Flooring Solutions",
      trim: true,
    },
  },
  { timestamps: true }
);

export const IndustrySection = mongoose.model(
  "IndustrySection",
  industrySectionSchema
);
