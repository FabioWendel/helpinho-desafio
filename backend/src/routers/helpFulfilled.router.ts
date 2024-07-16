import { Router } from "express";
import {
  createHelpFulfilled,
  getHelpFulfilled,
  getHelpFulfilledById,
  updateHelpFulfilled,
  deleteHelpFulfilled,
} from "../handlers/HelpFulfilled.handler";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  HelpFulfilledCreate,
  HelpFulfilledUpdate,
} from "../models/HelpFulfilled.model";
import { authenticateToken } from "../middleware/jwt.middleware";

const router = Router();

router.post(
  "/help-fulfilled/",
  authenticateToken,
  validationMiddleware(HelpFulfilledCreate),
  createHelpFulfilled
);
router.put(
  "/help-fulfilled/:id",
  authenticateToken,
  validationMiddleware(HelpFulfilledUpdate),
  updateHelpFulfilled
);
router.get("/help-fulfilled/", authenticateToken, getHelpFulfilled);
router.get("/help-fulfilled/:id", authenticateToken, getHelpFulfilledById);
router.delete("/help-fulfilled/:id", authenticateToken, deleteHelpFulfilled);

export default router;
