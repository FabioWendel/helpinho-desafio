"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHelp = exports.updateHelp = exports.createHelp = exports.getMyHelpers = exports.getHelpById = exports.getAllHelp = void 0;
const help_service_1 = require("../services/help.service");
const uuid_1 = require("uuid");
const s3_service_1 = require("../services/s3.service");
const getAllHelp = async (req, res) => {
    try {
        const requests = await help_service_1.helpService.getAllHelps();
        res.status(200).json(requests);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Error retrieving help requests",
            error: err.message,
        });
    }
};
exports.getAllHelp = getAllHelp;
const getHelpById = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await help_service_1.helpService.getHelpById(id);
        if (!request) {
            return res.status(404).json({ message: "Help request not found" });
        }
        res.status(200).json(request);
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: "Error retrieving help request", error: err.message });
    }
};
exports.getHelpById = getHelpById;
const getMyHelpers = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await help_service_1.helpService.getMyHelpers(id);
        if (!request) {
            return res.status(404).json({ message: "Help request not found" });
        }
        res.status(200).json(request);
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: "Error retrieving help request", error: err.message });
    }
};
exports.getMyHelpers = getMyHelpers;
const createHelp = async (req, res) => {
    try {
        const { goal, description, title, requesterId, category } = req.body;
        const image = req.file;
        if (!goal || !description || !title || !requesterId || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }
        const imageUrl = await (0, s3_service_1.uploadImageToS3)(image);
        const helpRequest = {
            id: (0, uuid_1.v4)(),
            goal,
            description,
            category,
            title,
            requesterId,
            image: imageUrl,
        };
        await help_service_1.helpService.createHelp(helpRequest);
        res.status(201).json(helpRequest);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating help request", error });
    }
};
exports.createHelp = createHelp;
const updateHelp = async (req, res) => {
    try {
        const id = req.params.id;
        const { goal, description, title, requesterId, category } = req.body;
        const image = req.file;
        if (!goal || !description || !title || !requesterId || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedRequest = {
            goal,
            description,
            title,
            requesterId,
            category,
        };
        if (image) {
            const imageUrl = await (0, s3_service_1.uploadImageToS3)(image);
            updatedRequest.image = imageUrl;
        }
        await help_service_1.helpService.updateHelp(id, updatedRequest);
        res.status(200).json({ message: "Help request updated successfully" });
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: "Error updating help request", error: err.message });
    }
};
exports.updateHelp = updateHelp;
const deleteHelp = async (req, res) => {
    try {
        const id = req.params.id;
        await help_service_1.helpService.deleteHelpRequest(id);
        res.status(200).json({ message: "Help request deleted successfully" });
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: "Error deleting help request", error: err.message });
    }
};
exports.deleteHelp = deleteHelp;
