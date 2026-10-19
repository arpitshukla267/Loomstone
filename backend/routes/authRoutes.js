import { Router } from "express";
import {
  login,
  getMe,
  sendOtp,
  resetPassword,
  updateEmail,
  getAdminEmail,
} from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Middleware that populates req.user if a Bearer token is present, but doesn't block if missing
const optionalAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return requireAuth(req, res, next);
  }
  next();
};

// Public endpoints
router.get("/admin-email", getAdminEmail);
router.post("/login", login);

// Session verification (requires valid JWT)
router.get("/me", requireAuth, getMe);

// Update admin email (requires valid JWT)
router.put("/email", requireAuth, updateEmail);

// OTP & Password Reset (works both for unauthenticated forgot password and authenticated sidebar change)
router.post("/password/send-otp", optionalAuth, sendOtp);
router.post("/password/reset", optionalAuth, resetPassword);

export default router;
