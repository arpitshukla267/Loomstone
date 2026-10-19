import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, 
    heading: { type: String, required: true, trim: true }, 
    desc: { type: String, required: true, trim: true },
    image: { type: String, required: true }, 
    imageId: { type: String, default: "" }, 
    href: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
