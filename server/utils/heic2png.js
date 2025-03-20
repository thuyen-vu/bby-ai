const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const heicConvert = require("heic-convert");

// Convert heic to png
async function convertHEICtoPNG(heicPath, pngPath) {
  try {
    const inputBuffer = fs.readFileSync(heicPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "PNG",
    });
    await sharp(outputBuffer).toFile(pngPath);
    console.log(`Converted heic to png: ${pngPath}`);
  } catch (error) {
    console.error("Error converting image:", error);
  }
}

// Unzip file
function unzipFile(zipPath, outputDirectory) {}

// Process directories and convert images
function processDirectories(directory, outputDirectory) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    const relativePath = path
      .relative(path.join(directory, ".."), filePath)
      .replace(".heic", ".png")
      .replace(".HEIC", ".png");
    const outputPath = path.join(outputDirectory, relativePath);
    const newDir = path.dirname(outputPath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    if (fs.statSync(filePath).isDirectory()) {
      processDirectories(filePath, outputDirectory);
    } else if (filePath.endsWith(".heic") || filePath.endsWith(".HEIC")) {
      convertHEICtoPNG(filePath, outputPath);
      // } else if (filePath.endsWith(".zip")) {
      //   unzipFile(filePath, outputPath);
    } else if (
      filePath.endsWith(".png") ||
      filePath.endsWith(".jpg") ||
      filePath.endsWith(".jpeg")
    ) {
      fs.copyFileSync(filePath, outputPath); // Copy non-HEIC file
    }
  });
}

processDirectories(
  "/Users/thuyenvu/Documents/Code/bbyai/server/public",
  "/Users/thuyenvu/Documents/Code/bbyai/client/public"
);
