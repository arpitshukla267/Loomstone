import ContactInfo from "../models/ContactInfo.js";

const FIELDS = [
  "email",
  "phone",
  "address",
  "instagram",
  "facebook",
  "x",
  "responseTime",
  "responseNote",
  "workshopLocation",
  "workshopNote",
];
const URL_FIELDS = ["instagram", "facebook", "x"];

const isHttpUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// Public: record nahi hai to {} bhejta hai, frontend apne hardcoded values dikhata hai
export const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findOne();
    res.json(info || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: ek hi document, nahi hai to ban jata hai
export const updateContactInfo = async (req, res) => {
  try {
    const updates = {};
    for (const f of FIELDS) {
      if (req.body[f] !== undefined) updates[f] = String(req.body[f]).trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    if (updates.email && !/^\S+@\S+\.\S+$/.test(updates.email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    // sirf http/https links, taaki javascript: jaisa kuch footer ke href mein na jaye
    for (const f of URL_FIELDS) {
      if (updates[f] && !isHttpUrl(updates[f])) {
        return res
          .status(400)
          .json({ message: `${f} link must start with http:// or https://` });
      }
    }

    const info = await ContactInfo.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
