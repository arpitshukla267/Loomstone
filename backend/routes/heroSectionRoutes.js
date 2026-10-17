import express from "express";
import makeUpload from "../middlewares/makeUpload.js";
import {
  getHeroSections,
  getAllHeroSections,
  getHeroSectionById,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
} from "../controllers/heroSectionController.js";

const router = express.Router();
const upload = makeUpload("hero-section");

router.get("/", getHeroSections);
router.get("/all", getAllHeroSections);
router.get("/:id", getHeroSectionById);
router.post("/", upload.single("image"), createHeroSection);
router.put("/:id", upload.single("image"), updateHeroSection);
router.delete("/:id", deleteHeroSection);

export default router;