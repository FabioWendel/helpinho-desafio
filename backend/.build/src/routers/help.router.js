"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const help_handler_1 = require("../handlers/help.handler");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const jwt_middleware_1 = require("../middleware/jwt.middleware");
const router = (0, express_1.Router)();
router.get("/help", help_handler_1.getAllHelp);
router.get("/helprs/:id", jwt_middleware_1.authenticateToken, help_handler_1.getMyHelpers);
router.get("/help/:id", jwt_middleware_1.authenticateToken, help_handler_1.getHelpById);
router.post("/help", jwt_middleware_1.authenticateToken, upload_middleware_1.default.single("image"), help_handler_1.createHelp);
router.put("/help/:id", jwt_middleware_1.authenticateToken, upload_middleware_1.default.single("image"), help_handler_1.updateHelp);
router.put("/help/:id", jwt_middleware_1.authenticateToken, help_handler_1.updateHelp);
router.delete("/help/:id", jwt_middleware_1.authenticateToken, help_handler_1.deleteHelp);
exports.default = router;
