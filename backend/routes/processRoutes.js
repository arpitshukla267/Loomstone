import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getProcess,
  updateProcessSection,
  createStep,
  updateStep,
  deleteStep,
  reorderSteps,
} from "../controllers/processController.js";

const router = Router();
const upload = makeUploader();

router.get("/", getProcess);
router.put("/section", requireAuth, updateProcessSection);
router.post("/steps", requireAuth, upload.single("media"), createStep);
router.put("/steps/:id", requireAuth, upload.single("media"), updateStep);
router.delete("/steps/:id", requireAuth, deleteStep);
router.patch("/steps/reorder", requireAuth, reorderSteps);

export default router;
