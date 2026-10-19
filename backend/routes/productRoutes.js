import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  toggleProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
const upload = makeUploader();

router.get("/", getProducts); // public: active products, admin: ?all=true
router.get("/:idOrSlug", getProductBySlugOrId);
router.post("/", requireAuth, upload.array("images", 10), createProduct);
router.put("/:id", requireAuth, upload.array("images", 10), updateProduct);
router.patch("/:id/toggle", requireAuth, toggleProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
