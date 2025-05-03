import fs from "fs-extra";
import path from "path";

const baseDir = path.join(__dirname, "..", "dist");

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
