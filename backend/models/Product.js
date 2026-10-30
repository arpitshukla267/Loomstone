import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    imageId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, index: true },
    desc: { type: String, default: "" },
    description: { type: String, default: "" },
    images: { type: [productImageSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.description = ret.description || ret.desc || "";
        ret.desc = ret.description;
        return ret;
      },
    },
  }
);

// Helper function to build a slug
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default mongoose.model("Product", productSchema);
