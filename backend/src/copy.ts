import fs from 'fs-extra';
import path from 'path';

const srcPath = path.join(__dirname,"..", 'src', 'swagger', 'swagger.yaml');
const destPath = path.join(__dirname,"..", 'dist', 'swagger', 'swagger.yaml');

fs.ensureDirSync(path.dirname(destPath));

fs.copyFileSync(srcPath, destPath);

console.log('Swagger YAML copied successfully.');
