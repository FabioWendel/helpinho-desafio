import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION_LOCALE });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error(
    "S3_BUCKET_NAME is not defined in the environment variables."
  );
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  }),
});

const uploadImageToS3 = async (file: Express.Multer.File) => {
  const key = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

export { upload, s3, uploadImageToS3 };
