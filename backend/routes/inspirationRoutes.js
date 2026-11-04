import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getInspirations,
  createInspiration,
  updateInspiration,
  deleteInspiration,
  reorderInspirations,
} from "../controllers/inspirationController.js";

const router = Router();
const upload = makeUploader();

router.get("/", getInspirations);
router.post("/", requireAuth, upload.single("image"), createInspiration);
router.put("/:id", requireAuth, upload.single("image"), updateInspiration);
router.delete("/:id", requireAuth, deleteInspiration);
router.patch("/reorder", requireAuth, reorderInspirations);

export default router;
