import { gridType, tile } from "./type";

export function forGrid(grid: gridType, f: (x: number, y: number, element: tile) => undefined) {
    for (const xStr in grid) {
        const x = parseInt(xStr);
        for (const yStr in grid[x]) {
            const y = parseInt(yStr);
            f(x, y, grid[x][y]);
        }
    }
}