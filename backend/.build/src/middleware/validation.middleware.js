"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validationMiddleware = (type) => {
    return async (req, res, next) => {
        const errors = await (0, class_validator_1.validate)((0, class_transformer_1.plainToInstance)(type, req.body));
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
exports.validationMiddleware = validationMiddleware;
