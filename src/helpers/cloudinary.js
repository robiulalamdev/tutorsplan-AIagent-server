const cloudinary = require("cloudinary").v2;
const VARIABLES = require("../config");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: VARIABLES.CLOUD_NAME,
  api_key: VARIABLES.API_KEY,
  api_secret: VARIABLES.API_SECRET,
});

async function uploadToCloudinary(filePath) {
  return await cloudinary.uploader.upload(filePath);
}

class CloudinaryStorage {
  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      // {
      //   folder: "uploads", // Optional: Specify a folder in your Cloudinary account
      // },
      (error, result) => {
        if (error) {
          cb(error);
        } else {
          cb(null, {
            ...result,
          });
        }
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.public_id, (error, result) => {
      if (error) {
        console.error("Error removing file from Cloudinary:", error);
      }
      cb(error, result);
    });
  }
}

const cloudinaryUpload = multer({ storage: new CloudinaryStorage() });

module.exports = {
  uploadToCloudinary,
  cloudinaryUpload,
};
