import mongoose from "mongoose";

const str = {type: String, trim: true, default: ""};

const contactInfoSchema = new mongoose.Schema(
  {
    email: str,
    phone: str, 
    address: str, 
    instagram: str,
    facebook: str,
    x: str,
    responseTime: str, 
    responseNote: str, 
    workshopLocation: str, 
    workshopNote: str, 
  },
  { timestamps: true }
);

export default mongoose.model("ContactInfo", contactInfoSchema );

