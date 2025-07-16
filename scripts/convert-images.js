// scripts/convert-to-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Konfigurácia
const INPUT_DIR = './public';
const OUTPUT_DIR = './public'; // Rovnaký priečinok
const QUALITY = 85;
const BATCH_SIZE = 5; // Paralelné spracovanie

// Utility funkcie
const getImageFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Priečinok ${dir} neexistuje!`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(dir);
  return files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file)
  );
};

const convertToWebP = async (inputPath, outputPath, quality = QUALITY) => {
  try {
    await sharp(inputPath)
      .webp({ 
        quality,
        effort: 6, // Maximálna kompresia
        lossless: false,
        nearLossless: false,
        smartSubsample: true,
        reductionEffort: 6
      })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`❌ Chyba pri konverzii ${inputPath}:`, error.message);
    return false;
  }
};

const getFileSize = (filePath) => {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2); // KB
};

const processInBatches = async (files, batchSize) => {
  const results = {
    converted: 0,
    failed: 0,
    totalSaved: 0
  };
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const promises = batch.map(async (file) => {
      const inputPath = path.join(INPUT_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      console.log(`🔄 Konvertujem: ${file}...`);
      
      const originalSize = getFileSize(inputPath);
      const success = await convertToWebP(inputPath, outputPath);
      
      if (success) {
        const newSize = getFileSize(outputPath);
        const saved = originalSize - newSize;
        
        console.log(`✅ ${file} → ${path.basename(outputPath)}`);
        console.log(`   Pôvodná veľkosť: ${originalSize} KB`);
        console.log(`   Nová veľkosť: ${newSize} KB`);
        console.log(`   Ušetrené: ${saved.toFixed(2)} KB (${((saved/originalSize)*100).toFixed(1)}%)`);
        console.log('');
        
        results.converted++;
        results.totalSaved += parseFloat(saved);
        
        // Voliteľne: vymazať pôvodný súbor
        // fs.unlinkSync(inputPath);
        
      } else {
        results.failed++;
      }
    });
    
    await Promise.all(promises);
  }
  
  return results;
};

// Hlavná funkcia
const main = async () => {
  console.log('🚀 Spúšťam konverziu PNG/JPG → WebP');
  console.log(`📁 Vstupný priečinok: ${INPUT_DIR}`);
  console.log(`📁 Výstupný priečinok: ${OUTPUT_DIR}`);
  console.log('');
  
  const imageFiles = getImageFiles(INPUT_DIR);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️ Neboli nájdené žiadne PNG/JPG súbory na konverziu.');
    return;
  }
  
  console.log(`📊 Nájdených súborov: ${imageFiles.length}`);
  imageFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');
  
  const startTime = Date.now();
  const results = await processInBatches(imageFiles, BATCH_SIZE);
  const endTime = Date.now();
  
  // Výsledná štatistika
  console.log('🎉 Konverzia dokončená!');
  console.log(`✅ Úspešne konvertovaných: ${results.converted}`);
  console.log(`❌ Neúspešných: ${results.failed}`);
  console.log(`💾 Celkovo ušetrené: ${results.totalSaved.toFixed(2)} KB`);
  console.log(`⏱️ Čas: ${((endTime - startTime) / 1000).toFixed(2)}s`);
  
  if (results.converted > 0) {
    console.log('');
    console.log('📝 Nezabudnite aktualizovať odkazy v kóde:');
    console.log('   image.webp → image.webp');
  }
};

// Spustenie
main().catch(console.error);
