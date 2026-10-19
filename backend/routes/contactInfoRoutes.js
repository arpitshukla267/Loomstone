import { Router } from "express";
import {
  getContactInfo,
  updateContactInfo,
} from "../controllers/contactInfoController.js";

const router = Router();

router.get("/", getContactInfo);
router.put("/", updateContactInfo);

export default router;
