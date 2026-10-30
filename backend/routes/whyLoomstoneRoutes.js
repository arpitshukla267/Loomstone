import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import {
  getWhyLoomstone,
  updateWhyLoomstone,
} from "../controllers/whyLoomstoneController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
const upload = makeUploader();

router.get("/", getWhyLoomstone);
router.put("/", requireAuth, upload.single("image"), updateWhyLoomstone);

export default router;
