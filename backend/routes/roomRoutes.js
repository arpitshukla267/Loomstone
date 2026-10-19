import { Router } from "express";
import makeUploader from "../middlewares/upload.js";
import {
  getRooms,
  createRoom,
  updateRoom,
  toggleRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
const upload = makeUploader();

router.get("/", getRooms); // public: active rooms, admin: ?all=true
router.post("/", requireAuth, upload.single("image"), createRoom);
router.put("/:id", requireAuth, upload.single("image"), updateRoom);
router.patch("/:id/toggle", requireAuth, toggleRoom);
router.delete("/:id", requireAuth, deleteRoom);

export default router;
