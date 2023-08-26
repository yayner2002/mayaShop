import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

// which storage engine to use where our files will be stored

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // cb = callback
    cb(null, "uploads/"); // folder where we want to upload our files
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // file.fieldname = name of the file, Date.now() = current date, path.extname(file.originalname) = extension of the file
  },
});

// function to check if the file is an image or not
function checkFileType(file, cb) {
  const fileTypes = /jpg|jpeg|png/; // regular expression
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // test if the extension name is in the fileTypes array
  const mimetype = fileTypes.test(file.mimetype); // test if the mimetype is in the fileTypes array

  if (extname && mimetype) {
    return cb(null, true); // if the file is an image
  } else {
    cb("Images only!"); // if the file is not an image
  }
}

// upload middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// upload route
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded successfully",
    image: `/${req.file.path}`,
    
  });
});

export default router;
