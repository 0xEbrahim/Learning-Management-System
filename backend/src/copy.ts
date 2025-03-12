import fs from "fs-extra";
import path from "path";

const baseDir = path.join(__dirname, "..", "dist");

const srcPath = path.join(__dirname, "..", "src", "swagger", "swagger.yaml");
const destSwagger = path.join(baseDir, "swagger", "swagger.yaml");
fs.ensureDirSync(path.dirname(destSwagger));
fs.copyFileSync(srcPath, destSwagger);
console.log("Swagger YAML copied successfully.");

const directories = [
  path.join(baseDir, "uploads"),
  path.join(baseDir, "uploads", "users"),
  path.join(baseDir, "uploads", "courses"),
  path.join(baseDir, "uploads", "videos"),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.ensureDirSync(dir);
  }
});

console.log("All necessary directories checked and ensured.");
