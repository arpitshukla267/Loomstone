import mongoose from "mongoose";

export const generateBlogSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    summary: { type: String, default: "", trim: true },
    content: { type: [String], default: [] },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    date: { type: String, default: "", trim: true },
    readTime: { type: String, default: "3 min read", trim: true },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
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

export default mongoose.model("Blog", blogSchema);
