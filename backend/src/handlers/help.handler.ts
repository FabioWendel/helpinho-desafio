import { Request, Response } from "express";
import { helpService } from "../services/help.service";
import { HelpCreate, HelpUpdate } from "../models/help.model";
import { v4 as uuidv4 } from "uuid";
import { uploadImageToS3 } from "../services/s3.service";

export const getAllHelp = async (req: Request, res: Response) => {
  try {
    const requests = await helpService.getAllHelps();
    res.status(200).json(requests);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Error retrieving help requests",
      error: err.message,
    });
  }
};

export const getHelpById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const request = await helpService.getHelpById(id);
    if (!request) {
      return res.status(404).json({ message: "Help request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error retrieving help request", error: err.message });
  }
};

export const getMyHelpers = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const request = await helpService.getMyHelpers(id);
    if (!request) {
      return res.status(404).json({ message: "Help request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error retrieving help request", error: err.message });
  }
};

export const createHelp = async (req: Request, res: Response) => {
  try {
    const { goal, description, title, requesterId, category } = req.body;
    const image = req.file;

    if (!goal || !description || !title || !requesterId || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = await uploadImageToS3(image);

    const helpRequest: HelpCreate = {
      id: uuidv4(),
      goal,
      description,
      category,
      title,
      requesterId,
      image: imageUrl,
    };

    await helpService.createHelp(helpRequest);

    res.status(201).json(helpRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating help request", error });
  }
};

export const updateHelp = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { goal, description, title, requesterId, category } = req.body;
    const image = req.file;

    if (!goal || !description || !title || !requesterId || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedRequest: Partial<HelpUpdate> = {
      goal,
      description,
      title,
      requesterId,
      category,
    };

    if (image) {
      const imageUrl = await uploadImageToS3(image);
      updatedRequest.image = imageUrl;
    }

    await helpService.updateHelp(id, updatedRequest);

    res.status(200).json({ message: "Help request updated successfully" });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error updating help request", error: err.message });
  }
};

export const deleteHelp = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await helpService.deleteHelpRequest(id);
    res.status(200).json({ message: "Help request deleted successfully" });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error deleting help request", error: err.message });
  }
};
