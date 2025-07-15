import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const optimizedDir = path.join(process.cwd(), 'public', 'optimized');

async function optimizeImages() {
  try {
    await fs.mkdir(optimizedDir, { recursive: true });
    const files = await fs.readdir(uploadsDir);

    for (const file of files) {
      const inputPath = path.join(uploadsDir, file);
      const outputPath = path.join(optimizedDir, file);
      const fileExtension = path.extname(file).toLowerCase();

      if (fileExtension === '.svg') {
        await fs.copyFile(inputPath, outputPath);
        console.log(`Copied ${file}`);
      } else {
        await sharp(inputPath)
          .resize({ width: 800 })
          .toFile(outputPath);
        console.log(`Optimized ${file}`);
      }
    }
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

optimizeImages();