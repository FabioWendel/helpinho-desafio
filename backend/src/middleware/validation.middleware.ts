import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

export const validationMiddleware = (type: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = await validate(
      plainToInstance(type, req.body)
    );
    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: formattedErrors });
    }
    next();
  };
};
