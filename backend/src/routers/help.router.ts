import { Router } from "express";
import {
  getAllHelp,
  getHelpById,
  createHelp,
  updateHelp,
  deleteHelp,
  getMyHelpers,
} from "../handlers/help.handler";
import upload from "../middleware/upload.middleware";
import { authenticateToken } from "../middleware/jwt.middleware";

const router = Router();

router.get("/help", getAllHelp);
router.get("/helprs/:id", authenticateToken, getMyHelpers);
router.get("/help/:id", authenticateToken, getHelpById);
router.post("/help", authenticateToken, upload.single("image"), createHelp);
router.put("/help/:id", authenticateToken, upload.single("image"), updateHelp);
router.put("/help/:id", authenticateToken, updateHelp);
router.delete("/help/:id", authenticateToken, deleteHelp);

export default router;
