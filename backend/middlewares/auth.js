import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authentication token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "loomstone_default_secret_key"
    );

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "User not found or access revoked" });
    }

    // Invalidate sessions if tokenVersion does not match
    if (
      decoded.tokenVersion !== undefined &&
      admin.tokenVersion !== undefined &&
      decoded.tokenVersion !== admin.tokenVersion
    ) {
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }

    req.user = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

export default requireAuth;
