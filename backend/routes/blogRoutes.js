import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
} from "../controllers/blogController.js";

const router = Router();
const upload = makeUploader();

router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogBySlug);
router.post("/", requireAuth, upload.single("image"), createBlog);
router.put("/:id", requireAuth, upload.single("image"), updateBlog);
router.delete("/:id", requireAuth, deleteBlog);
router.patch("/:id/toggle", requireAuth, toggleBlogPublish);

export default router;
