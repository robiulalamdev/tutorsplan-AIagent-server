const multer = require("multer");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

const isVideoFile = function (file) {
  const allowedExtensions = [".mkv", ".mp4", ".webm", ".ogg"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};

const isImageFile = function (file) {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};

const isPdfFile = function (file) {
  const allowedExtensions = [".pdf"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};
const isDocFile = function (file) {
  const allowedExtensions = [".doc"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};
const isDocxFile = function (file) {
  const allowedExtensions = [".docx"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};
const isZipFile = function (file) {
  const allowedExtensions = [".zip"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};
const isTxtFile = function (file) {
  const allowedExtensions = [".txt"];
  const ext = path.extname(file.originalname);
  return allowedExtensions.includes(ext);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;

    if (isVideoFile(file)) {
      uploadDir = "public/videos";
    } else if (isImageFile(file)) {
      uploadDir = "public/images/im";
    } else if (isPdfFile(file)) {
      uploadDir = "public/pdfs";
    } else if (isDocFile(file)) {
      uploadDir = "public/docs";
    } else if (isDocxFile(file)) {
      uploadDir = "public/docxs";
    } else if (isZipFile(file)) {
      uploadDir = "public/zips";
    } else if (isTxtFile(file)) {
      uploadDir = "public/txts";
    } else {
      return cb(new Error("Invalid file type"));
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + extName;
    file["name"] = uniqueSuffix;
    cb(null, uniqueSuffix + extName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB limit
  },
});

// Middleware for handling Multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "Multer error: " + err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }

  next();
};

const removeFile = async (path) => {
  if (path) {
    await fsExtra.remove(path);
  }
};

module.exports = {
  upload,
  handleMulterError,
  removeFile,
};
