"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHelpFulfilled = exports.updateHelpFulfilled = exports.getHelpFulfilledById = exports.getHelpFulfilled = exports.createHelpFulfilled = void 0;
const helpFulfilled_service_1 = require("../services/helpFulfilled.service");
const uuid_1 = require("uuid");
const createHelpFulfilled = async (req, res) => {
    try {
        const { helpId, donorId, amount } = req.body;
        const helpFulfilled = {
            id: (0, uuid_1.v4)(),
            helpId,
            donorId,
            amount,
        };
        await helpFulfilled_service_1.helpFulfilledService.createHelpFulfilled(helpFulfilled);
        res.status(201).json(helpFulfilled);
    }
    catch (error) {
        const err = error;
        res
            .status(400)
            .json({ message: "Error creating help fulfilled", error: err.message });
    }
};
exports.createHelpFulfilled = createHelpFulfilled;
const getHelpFulfilled = async (req, res) => {
    try {
        const helpRealizados = await helpFulfilled_service_1.helpFulfilledService.getAllHelpFulfilled();
        res.status(200).json(helpRealizados);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching help realizados", error });
    }
};
exports.getHelpFulfilled = getHelpFulfilled;
const getHelpFulfilledById = async (req, res) => {
    try {
        const id = req.params.id;
        const helpFulfilled = await helpFulfilled_service_1.helpFulfilledService.getHelpFulfilledById(id);
        if (!helpFulfilled) {
            return res.status(404).json({ message: "Help fulfilled not found" });
        }
        res.status(200).json(helpFulfilled);
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: "Error retrieving help fulfilled", error: err.message });
    }
};
exports.getHelpFulfilledById = getHelpFulfilledById;
const updateHelpFulfilled = async (req, res) => {
    try {
        const id = req.params.id;
        const { helpId, donorId, amount, request } = req.body;
        const updatedHelpFulfilled = {
            helpId,
            donorId,
            amount,
        };
        await helpFulfilled_service_1.helpFulfilledService.updateHelpFulfilled(id, updatedHelpFulfilled);
        res.status(200).json({ message: "Help fulfilled updated successfully" });
    }
    catch (error) {
        const err = error;
        res
            .status(400)
            .json({ message: "Error updating help fulfilled", error: err.message });
    }
};
exports.updateHelpFulfilled = updateHelpFulfilled;
const deleteHelpFulfilled = async (req, res) => {
    try {
        const id = req.params.id;
        await helpFulfilled_service_1.helpFulfilledService.deleteHelpFulfilled(id);
        res.status(204).end();
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: "Error deleting help fulfilled", error: err.message });
    }
};
exports.deleteHelpFulfilled = deleteHelpFulfilled;
