import mongoose from "mongoose";

const clientLogoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    logoPublicId: { type: String, default: "" },
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

export const ClientLogo = mongoose.model("ClientLogo", clientLogoSchema);

const testimonialSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const clienteleSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Built on Expertise.",
      trim: true,
    },
    headingHighlight: {
      type: String,
      default: "Defined by Trust.",
      trim: true,
    },
    description: {
      type: String,
      default:
        "We partner with architects, designers, developers and hospitality groups to deliver tailored flooring solutions, backed by design collaboration, quality and dependable project coordination.",
      trim: true,
    },
    subheading: {
      type: String,
      default: "Thoughtful Collaboration. Lasting Partnerships.",
      trim: true,
    },
    testimonialsHeading: {
      type: String,
      default: "What Our Clients Says",
      trim: true,
    },
    testimonials: {
      type: [testimonialSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const ClienteleSection = mongoose.model(
  "ClienteleSection",
  clienteleSectionSchema
);
