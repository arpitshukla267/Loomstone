import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const makeUploader = (subFolder = "") =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: subFolder ? `loomstone/${subFolder}` : "loomstone",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

export default makeUploader;
