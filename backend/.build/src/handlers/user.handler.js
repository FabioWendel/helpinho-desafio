"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.userService.getAllUsers();
        res.json(users);
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Error retrieving users", error: err.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const user = await user_service_1.userService.getUserById(req.params.id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send({ message: "User not found" });
        }
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Error retrieving user", error: err.message });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const user = await user_service_1.userService.createUser(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        const err = error;
        res
            .status(400)
            .send({ message: "Error creating user", error: err.message });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        await user_service_1.userService.updateUser(req.params.id, req.body);
        res.send("User updated");
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Error updating user", error: err.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        await user_service_1.userService.deleteUser(req.params.id);
        res.send("User deleted");
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Error deleting user", error: err.message });
    }
};
exports.deleteUser = deleteUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_service_1.userService.authenticateUser(email, password);
        if (user) {
            const token = (0, jwt_middleware_1.generateToken)(user.id);
            res.json({ token, user: user.name, id: user.id });
        }
        else {
            res.status(401).send({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        const err = error;
        res.status(500).send({ message: "Error during login", error: err.message });
    }
};
exports.login = login;
