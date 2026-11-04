import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    media: {
      type: String,
      default: "",
    },
    mediaPublicId: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
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

const processSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "From Vision to Exceptional Spaces",
      trim: true,
    },
    intro: {
      type: String,
      default:
        "At Loomstone, exceptional flooring begins with a clear vision and is realised through meticulous execution. We guide every project from concept to completion, creating floors that elevate the character and identity of a space.",
      trim: true,
    },
    steps: {
      type: [processStepSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProcessSection", processSectionSchema);
