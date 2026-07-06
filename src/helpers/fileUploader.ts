import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Readable } from "stream";
import ApiError from "../errors/ApiErrors";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid =
    allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext);

  if (!isValid) {
    return cb(
      new ApiError(
        400,
        `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`,
      ) as unknown as Error,
    );
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadSingleImage = upload.single("image");

const uploadToCloudinary = (
  file: Express.Multer.File,
  folder = "mini-erp/products",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return reject(new ApiError(500, "Failed to upload image"));
        }
        resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

const removeFromCloudinary = (url: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(url, (error, result) => {
      if (error || !result) {
        console.error("Cloudinary upload error:", error);
        return reject(new ApiError(500, "Failed to remove image"));
      }
      resolve(result);
    });
  });
};

export const fileUploader = {
  uploadSingleImage,
  uploadToCloudinary,
  removeFromCloudinary,
};
