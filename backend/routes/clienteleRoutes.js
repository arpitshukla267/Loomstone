import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getClientele,
  updateClienteleSection,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
  reorderClientLogos,
} from "../controllers/clienteleController.js";

const router = Router();
const upload = makeUploader();

router.get("/", getClientele);
router.put("/section", requireAuth, updateClienteleSection);
router.post("/clients", requireAuth, upload.single("logo"), createClientLogo);
router.put("/clients/:id", requireAuth, upload.single("logo"), updateClientLogo);
router.delete("/clients/:id", requireAuth, deleteClientLogo);
router.patch("/clients/reorder", requireAuth, reorderClientLogos);

export default router;
