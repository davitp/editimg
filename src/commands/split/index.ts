import { createCommand } from "commander";
import { asyncHandler, resolveDirectory } from "../common";
import { Path, glob } from "glob";
import path from 'path';
import { ImageEntry } from "@/core/types";
import fsPromise from 'fs/promises'
import splitImage from "@/services/split-image";
import { logger } from "@/services/logger";

const VALID_PART_VARIANTS: Record<string, { rows: number, cols: number }> = {
    '1': { rows: 1, cols: 1 },
    '2': { rows: 1, cols: 2 },
    '3': { rows: 1, cols: 3 },
    '4': { rows: 2, cols: 2 },
    '6': { rows: 2, cols: 3 },
    '8': { rows: 2, cols: 4 },
    '9': { rows: 3, cols: 3 },
    '12': { rows: 3, cols: 4 },
    '16': { rows: 4, cols: 4 },
}
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

const splitCommand = createCommand('split')

splitCommand
    .description('Add new context to the configuration')
    .option('-i, --input <path>', 'the input folder path', '.')
    .option('-p, --parts <number>', 'the number of output parts', '4')
    .action(asyncHandler(async (options, cmd) => {

        const { input, parts } = options;
        const now = new Date()

        const partsRowCol = VALID_PART_VARIANTS[parts.toString()];

        if(!partsRowCol){
            throw Error(`The '${parts}' is invalid number of parts`);
        }
        
        const dir = await resolveDirectory(input);
        const images = await getImageFiles(dir)

        const outputDir = `${dir}/split_${now.getFullYear()}_${now.getMonth()}_${now.getDay()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`
        await fsPromise.mkdir(outputDir, { recursive: true });

        const { rows, cols } = partsRowCol;

        await Promise.all(images.map(file => splitImage({
            file, outputDir, rows, cols
         })));

        logger.just("All images processed successfully.");
    }));

async function getImageFiles(directory: string): Promise<ImageEntry[]> {

    const list: Path[] = await glob(
        `*.{${IMAGE_EXTENSIONS.join(',')}}`,
        {
            cwd: directory,
            nodir: true,
            withFileTypes: true
        }
    );

    return list.map(item => {

        const { shortname, extension } = getFileInfo(item.fullpath())

        return {
            fullname: item.fullpath(),
            name: item.name,
            shortname,
            extension
        }
    })
}

function getFileInfo(fullname: string): { shortname: string, extension: string } {
    const { name, ext } = path.parse(fullname);
    return { shortname: name, extension: ext.slice(1) };
}

export default splitCommand;
