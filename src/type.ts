
export type player = 'r' | 'b';
export type tile = 'e' | 'r' | 'b' | 't';
export type gridType = tile[][];
export type gridPos = { x: number, y: number };

export type GameState = {
    grid: gridType;
    whichTurn: player;
    turnNumber: 0 | 1;

    gridXMin: number;
    gridXMax: number;

    gridYMin: number;
    gridYMax: number;
}

export type Hex_Cube = { x: number, y: number, z: number }

export type Move = [gridPos, gridPos];