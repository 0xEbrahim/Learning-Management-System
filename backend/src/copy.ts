import fs from "fs-extra";
import path from "path";

let srcPath = path.join(__dirname, "..", "src", "swagger", "swagger.yaml");
let destPath = path.join(__dirname, "..", "dist", "swagger", "swagger.yaml");
fs.ensureDirSync(path.dirname(destPath));
fs.copyFileSync(srcPath, destPath);
destPath = path.join(__dirname, "..", "dist", "uploads", "users", "image.png");
fs.ensureDirSync(path.dirname(destPath));
destPath = path.join(
  __dirname,
  "..",
  "dist",
  "uploads",
  "courses",
  "image.png"
);
fs.ensureDirSync(path.dirname(destPath));
destPath = path.join(__dirname, "..", "dist", "uploads", "users", "image.png");
fs.ensureDirSync(path.dirname(destPath));
destPath = path.join(
  __dirname,
  "..",
  "dist",
  "uploads",
  "courses",
  "image.png"
);
fs.ensureDirSync(path.dirname(destPath));
console.log("Swagger YAML copied successfully.");
