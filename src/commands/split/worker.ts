import sharp from 'sharp';
import path from 'path';
import { ImageEntry } from '@/core/types';

export default async function splitImage({ file, outputDir, rows, cols }: { file: ImageEntry, outputDir: string, rows: number, cols: number }) {
    try {
        const image = sharp(file.fullname);
        const metadata = await image.metadata();
        const { width, height } = metadata;

        if (!width || !height) {
            throw new Error(`Invalid image: ${file.fullname}`);
        }
        
        const partWidth = Math.floor(width / cols);
        const partHeight = Math.floor(height / rows);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * partWidth;
                const y = row * partHeight;

                const outputFilePath = path.join(outputDir, `${file.shortname}-part-${row}-${col}.${file.extension}`);
                
                await image
                    .extract({ left: x, top: y, width: partWidth, height: partHeight })
                    .toFile(outputFilePath);

                console.log(`Saved: ${outputFilePath}`);
            }
        }
    } catch (error) {
        console.error(`Error processing ${file.fullname}:`, error);
    }
}
