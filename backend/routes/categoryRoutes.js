import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
const upload = makeUploader();

router.get("/", getCategories); // public: active categories, admin: ?all=true
router.post("/", requireAuth, upload.single("image"), createCategory);
router.put("/:id", requireAuth, upload.single("image"), updateCategory);
router.patch("/:id/toggle", requireAuth, toggleCategory);
router.delete("/:id", requireAuth, deleteCategory);

export default router;
