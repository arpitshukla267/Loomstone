import express from "express";
import makeUpload from "../middlewares/upload.js";
import {
  getHeroSections,
  getAllHeroSections,
  getHeroSectionById,
  createHeroSection,
  updateHeroSection,
  toggleHeroSection,
  deleteHeroSection,
} from "../controllers/heroSectionController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();
const upload = makeUpload();

router.get("/", getHeroSections);
router.get("/all", getAllHeroSections);
router.get("/:id", getHeroSectionById);
router.post("/", requireAuth, upload.single("image"), createHeroSection);
router.put("/:id", requireAuth, upload.single("image"), updateHeroSection);
router.patch("/:id/toggle", requireAuth, toggleHeroSection);
router.delete("/:id", requireAuth, deleteHeroSection);

export default router;