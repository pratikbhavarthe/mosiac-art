import { processImage } from "./imageProcessing";
import { findClosestEmoji } from "./emojiMapping";

export async function generateMosaic(imagePath: string, gridSize = 128) {
    const grid = await processImage(imagePath, gridSize);
    
    return grid.map(cell => ({
        ...cell,  emoji: findClosestEmoji({ r: cell.r, g: cell.g, b: cell.b })?.char
    }));
}