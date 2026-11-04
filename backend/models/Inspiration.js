import mongoose from "mongoose";

const inspirationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    category: { type: String, default: "", trim: true },
    label: { type: String, default: "", trim: true },
    text: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
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

export default mongoose.model("Inspiration", inspirationSchema);
