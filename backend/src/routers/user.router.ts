import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from "../handlers/user.handler";
import { UserCreate, UserUpdate } from "../models/user.model";
import { Login } from "../models/login.model";
import { validationMiddleware } from "../middleware/validation.middleware";
import { authenticateToken } from "../middleware/jwt.middleware";

const router = Router();

router.get("/users", authenticateToken, getAllUsers);
router.get("/users/:id", authenticateToken, getUserById);
router.post("/users", validationMiddleware(UserCreate), createUser);
router.put(
  "/users/:id",
  authenticateToken,
  validationMiddleware(UserUpdate),
  updateUser
);
router.delete("/users/:id", authenticateToken, deleteUser);
router.post("/login", validationMiddleware(Login), login);

export default router;
