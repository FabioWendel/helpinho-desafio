import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { generateToken } from "../middleware/jwt.middleware";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Error retrieving users", error: err.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Error retrieving user", error: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    const err = error as Error;
    res
      .status(400)
      .send({ message: "Error creating user", error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.send("User updated");
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Error updating user", error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);
    res.send("User deleted");
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Error deleting user", error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
    if (user) {
      const token = generateToken(user.id);
      res.json({ token, user: user.name, id: user.id });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ message: "Error during login", error: err.message });
  }
};
