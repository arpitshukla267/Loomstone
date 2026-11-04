import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getIndustries,
  updateSection,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} from "../controllers/industryController.js";

const router = Router();
const upload = makeUploader();

router.get("/", getIndustries);
router.put("/section", requireAuth, updateSection);
router.post("/cards", requireAuth, upload.single("image"), createCard);
router.put("/cards/:id", requireAuth, upload.single("image"), updateCard);
router.delete("/cards/:id", requireAuth, deleteCard);
router.patch("/cards/reorder", requireAuth, reorderCards);

export default router;
