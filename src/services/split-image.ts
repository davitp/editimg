import sharp from 'sharp';
import path from 'path';
import { ImageEntry } from '@/core/types';
import { logger } from './logger';

export default async function splitImage({ file, outputDir, rows, cols }: { file: ImageEntry, outputDir: string, rows: number, cols: number }) {
    try {
        const image = sharp(file.fullname);
        const metadata = await image.metadata();
        const { width, height } = metadata;

        if (!width || !height) {
            throw new Error(`Invalid image: ${file.fullname}`);
        }

        const baseWidth = Math.floor(width / cols);
        const baseHeight = Math.floor(height / rows);


        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * baseWidth;
                const y = row * baseHeight;

                const cropWidth = (col === cols - 1) ? (width - x) : baseWidth;
                const cropHeight = (row === rows - 1) ? (height - y) : baseHeight;

                if (x < 0 || y < 0 || cropWidth <= 0 || cropHeight <= 0 || x + cropWidth > width || y + cropHeight > height) {
                    console.warn(`Skipping invalid extract at (x=${x}, y=${y}) with size (${cropWidth}x${cropHeight})`);
                    continue;
                }

                const outputFilePath = path.join(outputDir, `${file.shortname}-part-${row}-${col}.${file.extension}`);
                
                await image
                    .resize(metadata.width, metadata.height, { fit: 'fill' })
                    .extract({ left: x, top: y, width: cropWidth, height: cropHeight })
                    .toFile(outputFilePath);

                logger.just(`Saved: ${outputFilePath}`);
            }
        }
    } catch (error) {
        logger.error(`Error processing ${file.fullname}: ${(error as any).message}`);
    }
}
