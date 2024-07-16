import { Request, Response } from "express";
import {
  HelpFulfilledCreate,
  HelpFulfilledUpdate,
} from "../models/HelpFulfilled.model";
import { helpFulfilledService } from "../services/helpFulfilled.service";
import { v4 as uuidv4 } from "uuid";

export const createHelpFulfilled = async (req: Request, res: Response) => {
  try {
    const { helpId, donorId, amount } = req.body;

    const helpFulfilled: HelpFulfilledCreate = {
      id: uuidv4(),
      helpId,
      donorId,
      amount,
    };

    await helpFulfilledService.createHelpFulfilled(helpFulfilled);

    res.status(201).json(helpFulfilled);
  } catch (error) {
    const err = error as Error;
    res
      .status(400)
      .json({ message: "Error creating help fulfilled", error: err.message });
  }
};

export const getHelpFulfilled = async (req: Request, res: Response) => {
  try {
    const helpRealizados = await helpFulfilledService.getAllHelpFulfilled();
    res.status(200).json(helpRealizados);
  } catch (error) {
    res.status(500).json({ message: "Error fetching help realizados", error });
  }
};

export const getHelpFulfilledById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const helpFulfilled = await helpFulfilledService.getHelpFulfilledById(id);

    if (!helpFulfilled) {
      return res.status(404).json({ message: "Help fulfilled not found" });
    }

    res.status(200).json(helpFulfilled);
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error retrieving help fulfilled", error: err.message });
  }
};

export const updateHelpFulfilled = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { helpId, donorId, amount, request } = req.body;

    const updatedHelpFulfilled: Partial<HelpFulfilledUpdate> = {
      helpId,
      donorId,
      amount,
    };

    await helpFulfilledService.updateHelpFulfilled(id, updatedHelpFulfilled);

    res.status(200).json({ message: "Help fulfilled updated successfully" });
  } catch (error) {
    const err = error as Error;
    res
      .status(400)
      .json({ message: "Error updating help fulfilled", error: err.message });
  }
};

export const deleteHelpFulfilled = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    await helpFulfilledService.deleteHelpFulfilled(id);

    res.status(204).end();
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error deleting help fulfilled", error: err.message });
  }
};
