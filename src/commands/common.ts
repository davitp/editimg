import { logger } from "@/services/logger";
import fs from 'fs';

export const asyncHandler = (fn: (...args: any[]) => Promise<void>) => (...args: any[]) => {
    fn(...args).catch((err) => {
        logger.error(`${err.message}`);
        process.exit(1);
    });
};

export function resolveDirectory(input: string): string {

    let resolvedDir = input ?? process.cwd()

    if(resolvedDir.endsWith('/')){
        resolvedDir.substring(0, resolvedDir.length - 1)
    }

    if(!fs.existsSync(resolvedDir)){
        throw new Error(`The directory ${resolvedDir} does not exist`)
    }

    if(!fs.lstatSync(resolvedDir).isDirectory()){
        throw new Error(`The path ${resolvedDir} is not a directory`)
    }

    return resolvedDir
}