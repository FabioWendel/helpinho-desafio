"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToS3 = exports.s3 = exports.upload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3 = new client_s3_1.S3Client({ region: process.env.AWS_REGION_LOCALE });
exports.s3 = s3;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
if (!BUCKET_NAME) {
    throw new Error("S3_BUCKET_NAME is not defined in the environment variables.");
}
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, `${(0, uuid_1.v4)()}-${file.originalname}`);
        },
    }),
});
exports.upload = upload;
const uploadImageToS3 = async (file) => {
    const key = `${(0, uuid_1.v4)()}-${file.originalname}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    await s3.send(command);
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};
exports.uploadImageToS3 = uploadImageToS3;
