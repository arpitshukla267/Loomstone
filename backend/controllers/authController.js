import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { sendOtpEmail } from "../utils/email.js";

const JWT_SECRET = process.env.JWT_SECRET || "loomstone_default_secret_key";
const JWT_EXPIRES_IN = "7d";

// Generates JWT token with tokenVersion for session invalidation
const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      tokenVersion: admin.tokenVersion || 0,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Auto-seed initial admin if none exists
export const ensureDefaultAdmin = async () => {
  let admin = await Admin.findOne();
  if (!admin) {
    const initialEmail =
      process.env.PASS_RESET ||
      process.env.RECIPIENT_EMAIL ||
      "shuklaarpit440@gmail.com";
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "Loomstone@2026";

    console.log(`[AUTH] Initializing default CMS admin account for ${initialEmail}...`);
    admin = await Admin.create({
      email: initialEmail.toLowerCase().trim(),
      password: initialPassword,
      role: "admin",
      tokenVersion: 0,
    });
    console.log("[AUTH] Default CMS admin account created successfully.");
  }
  return admin;
};

/**
 * GET /api/auth/admin-email
 * Public endpoint so CMS forms can display the registered admin email
 */
export const getAdminEmail = async (req, res) => {
  try {
    const admin = await ensureDefaultAdmin();
    return res.json({ success: true, email: admin.email });
  } catch (err) {
    return res.json({ success: true, email: "shuklaarpit440@gmail.com" });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Note: OTP is NOT required for login.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const admin = await ensureDefaultAdmin();
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    // If an email was provided in login form, sync it with the admin record
    if (email && email.trim() && admin.email !== email.toLowerCase().trim()) {
      admin.email = email.toLowerCase().trim();
      await admin.save();
    }

    const token = createToken(admin);
    return res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    return res.status(500).json({ error: "Internal server error during sign in" });
  }
};

/**
 * GET /api/auth/me
 * Protected by requireAuth
 */
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    console.error("[AUTH] getMe error:", err);
    return res.status(500).json({ error: "Failed to verify session" });
  }
};

/**
 * PUT /api/auth/email
 * Protected by requireAuth - allows logged in admin to update their email
 */
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required" });
    }

    const admin = req.user;
    admin.email = email.toLowerCase().trim();
    await admin.save();

    console.log(`[AUTH] Admin email updated to: ${admin.email}`);
    return res.json({
      success: true,
      message: "Admin email updated successfully",
      email: admin.email,
    });
  } catch (err) {
    console.error("[AUTH] updateEmail error:", err);
    return res.status(500).json({ error: "Failed to update email" });
  }
};

/**
 * POST /api/auth/password/send-otp
 * Body: { email } (optional - updates admin email if provided)
 * Generates OTP, logs to terminal, and sends via email if configured
 */
export const sendOtp = async (req, res) => {
  try {
    let admin = req.user;
    if (!admin) {
      admin = await ensureDefaultAdmin();
    }

    // If admin supplied/edited an email in the reset form, use and save it
    if (req.body?.email && req.body.email.trim()) {
      const formatted = req.body.email.toLowerCase().trim();
      if (formatted.includes("@")) {
        admin.email = formatted;
      }
    }

    // Cooldown check (30 seconds)
    if (admin.otpLastSent) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(admin.otpLastSent).getTime()) / 1000
      );
      if (elapsedSeconds < 30) {
        const remaining = 30 - elapsedSeconds;
        return res.status(429).json({
          error: `Please wait ${remaining}s before requesting a new OTP.`,
        });
      }
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    admin.otp = otp;
    admin.otpExpires = expiresAt;
    admin.otpLastSent = new Date();
    await admin.save();

    // Print to terminal and trigger email delivery
    await sendOtpEmail(admin.email, otp);

    return res.json({
      success: true,
      message: `A 6-digit OTP has been sent for ${admin.email} (logged to backend terminal).`,
      email: admin.email,
    });
  } catch (err) {
    console.error("[AUTH] sendOtp error:", err);
    return res.status(500).json({ error: "Failed to generate OTP. Please try again." });
  }
};

/**
 * POST /api/auth/password/reset
 * Body: { email, otp, newPassword }
 */
export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({ error: "OTP and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    let admin = req.user;
    if (!admin) {
      if (email && email.trim()) {
        admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      }
      if (!admin) {
        admin = await Admin.findOne();
      }
    }

    if (!admin) {
      return res.status(404).json({ error: "Admin account not found" });
    }

    if (!admin.otp || admin.otp !== otp.toString().trim()) {
      return res.status(400).json({ error: "Invalid OTP code. Please check terminal and try again." });
    }

    if (!admin.otpExpires || new Date() > new Date(admin.otpExpires)) {
      return res.status(400).json({
        error: "The OTP code has expired. Please request a new one.",
      });
    }

    // Save new password (pre-save hook hashes it) and clear OTP
    admin.password = newPassword;
    admin.otp = null;
    admin.otpExpires = null;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1; // Invalidate older sessions
    await admin.save();

    // Generate fresh token
    const newToken = createToken(admin);

    return res.json({
      success: true,
      message: "Password changed successfully",
      token: newToken,
    });
  } catch (err) {
    console.error("[AUTH] resetPassword error:", err);
    return res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
};
