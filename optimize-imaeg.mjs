// RRenov/optimize_images.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'client', 'public', 'projects');
const outputDir = path.join(__dirname, 'client', 'public', 'optimized-projects');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
    console.log(`Starting image optimization from ${inputDir} to ${outputDir}`);

    const categories = fs.readdirSync(inputDir).filter(file => 
        fs.statSync(path.join(inputDir, file)).isDirectory()
    );

    for (const category of categories) {
        const categoryInputDir = path.join(inputDir, category);
        const categoryOutputDir = path.join(outputDir, category);

        if (!fs.existsSync(categoryOutputDir)) {
            fs.mkdirSync(categoryOutputDir, { recursive: true });
        }

        const files = fs.readdirSync(categoryInputDir).filter(file => 
            /\.(jpe?g|png|jpg)$/i.test(file)
        );

        console.log(`Processing ${files.length} images in category: ${category}`);

        for (const file of files) {
            const inputPath = path.join(categoryInputDir, file);
            const outputFileName = path.parse(file).name + '.webp';
            const outputPath = path.join(categoryOutputDir, outputFileName);

            try {
                await sharp(inputPath)
                    .resize(1200) // Redimensionne à 1200px de large
                    .webp({ quality: 80 }) // Convertit en WebP avec 80% de qualité
                    .toFile(outputPath);
                
                console.log(`  Optimized: ${file} -> ${outputFileName}`);
            } catch (error) {
                console.error(`  Error optimizing ${file}:`, error.message);
            }
        }
    }

    console.log('Image optimization complete.');
}

optimizeImages().catch(console.error);
