import { MAXGRIDRADIUS, MINGRIDRADIUS } from "./const.js";
import { gridRadius, gridx, gridy } from "./main.js";
import { gridPos, gridType, Hex_Cube, tile } from "./type.js";

export function forGrid(grid: gridType, f: (x: number, y: number, element: tile) => undefined) {
    for (const xStr in grid) {
        const x = parseInt(xStr);
        for (const yStr in grid[x]) {
            const y = parseInt(yStr);
            f(x, y, grid[x][y]);
        }
    }
}

export function copyGrid(grid: gridType): gridType {
    const newGrid: gridType = [];
    for (const x in grid) {
        const xIndex = Number(x);
        
        if (grid[xIndex]) {
            newGrid[xIndex] = [];
            for (const y in grid[xIndex]) {
                const yIndex = Number(y);
                newGrid[xIndex][yIndex] = grid[xIndex][yIndex];
            }
        }
    }

    return newGrid;
}

export function gridRadiusMinMax(r: number) {
    return Math.min(MAXGRIDRADIUS, Math.max(MINGRIDRADIUS, r));
}


export function point_to_Hex(x: number, y: number) {

    // invert the scaling and transfomation
    let x2 = (x - gridx) / gridRadius
    let y2 = (y - gridy) / gridRadius

    // cartesian to hex
    let q = (Math.sqrt(3) / 3 * x2 - 1. / 3 * y2)
    let r = (2. / 3 * y2)
    return round_Hex_Axial({ x: q, y: r });

}


export function round_Hex_Axial(frac: gridPos): gridPos {
    return cube_to_axial(round_Hex_Cube(axial_to_cube(frac)));

}

export function round_Hex_Cube(frac: Hex_Cube): Hex_Cube {
    var q = Math.round(frac.x)
    var r = Math.round(frac.y)
    var s = Math.round(frac.z)

    var q_diff = Math.abs(q - frac.x)
    var r_diff = Math.abs(r - frac.y)
    var s_diff = Math.abs(s - frac.z)

    if (q_diff > r_diff && q_diff > s_diff) {
        q = -r - s
    } else if (r_diff > s_diff) {
        r = -q - s
    } else {
        s = -q - r
    }

    return { x: q, y: r, z: s }
}

export function cube_to_axial(cube: Hex_Cube): gridPos {
    return { x: cube.x, y: cube.y }
}

export function axial_to_cube(hex: gridPos): Hex_Cube {
    var q = hex.x
    var r = hex.y
    var s = -q - r
    return { x: q, y: r, z: s }
}