import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isProfPic =
      req.baseUrl === "/api/v1/users" || req.baseUrl === "/api/v1/auth";
    const isCourse = req.baseUrl === "/api/v1/courses";
    cb(
      null,
      `${__dirname}/../uploads/${
        isProfPic ? "users" : isCourse ? "courses" : ""
      }`
    );
  },
  filename: function (req, file, callback) {
    const filename =
      Math.random() * Date.now() +
      "-" +
      parseInt(
        Math.ceil(Math.random() * Date.now())
          .toPrecision(16)
          .toString()
          .replace(".", "")
      ) +
      path.extname(file.originalname);
    callback(null, filename);
  },
});

const fileFilter = function (req: any, file: any, cb: any) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/mpeg"
  )
    cb(null, true);
  else cb({ message: "Unsupported file format" }, false);
};

const uplaoder = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
});

export default uplaoder;
