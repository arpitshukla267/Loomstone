import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getFounder,
  updateFounder,
} from "../controllers/founderController.js";

const router = Router();
const upload = makeUploader();

router.get("/", getFounder);
router.put("/", requireAuth, upload.single("image"), updateFounder);

export default router;
