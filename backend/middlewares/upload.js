import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const makeUploader = () =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "loomstone",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });

export default makeUploader;
