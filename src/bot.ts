import { PLACE_RANGE } from "./const.js";
import { Game } from "./game.js";
import { draw } from "./main.js";
import { gridPos, Move, tile } from "./type.js";



export let bestMove: Move;
export let count: number;

export function startMinMax(game: Game, depth: number) {

    count = 0;
    let time = Date.now();

    let botGame = new BotGame(game);

    minMax(botGame, depth, -Infinity, Infinity);

    time = Date.now() - time;
    console.log("count: " + count);
    console.log("time: " + time + "ms");



}

export function minMax(game: BotGame, depth: number, alpha: number, beta: number): number {
    count++;
    if (depth == 0) {
        return game.evaluateBoard();
    }

    let allMoves = game.allPossibleMove();

    let bestScore = -Infinity;
    let bestPos = -1;


    for (let i = 0; i < allMoves.length; i++) {

        let move1 = allMoves[i][0];
        let move2 = allMoves[i][1];

        let gridXMin = game.gridXMin;
        let gridXMax = game.gridXMax;
        let gridYMin = game.gridYMin;
        let gridYMax = game.gridYMax;

        // make move
        let before1 = game.setBeforeTile(move1, game.whichTurn);
        let before2 = game.setBeforeTile(move2, game.whichTurn);
        let beforeList1 = game.beforeExpandBorder(move1);
        let beforeList2 = game.beforeExpandBorder(move2);
        game.whichTurn = game.whichTurn == 'b' ? 'r' : 'b';

        let score = -minMax(game, depth - 1, -beta, -alpha);

        // undo move
        game.whichTurn = game.whichTurn == 'b' ? 'r' : 'b';
        game.undoBeforeTile(before1);
        game.undoBeforeTile(before2);
        game.undoBeforeTileList(beforeList1);
        game.undoBeforeTileList(beforeList2);
        game.gridXMin = gridXMin;
        game.gridXMax = gridXMax;
        game.gridYMin = gridYMin;
        game.gridYMax = gridYMax;


        if (score >= beta) return beta; // Skip the rest of this branch
        if (score > alpha) {
            alpha = score;
            bestPos = i;
        }
    }

    bestMove = allMoves[bestPos];

    return alpha;
}


type BeforeTile = { pos: gridPos, tile: tile };


class BotGame extends Game {
    constructor(game: Game) {
        super();
        this.grid = game.grid;
        this.whichTurn = game.whichTurn;
        this.turnNumber = game.turnNumber;
        this.gridXMin = game.gridXMin;
        this.gridXMax = game.gridXMax;
        this.gridYMin = game.gridYMin;
        this.gridYMax = game.gridYMax;

        this.history = game.history;
        this.historyPos = game.historyPos;
    }

    public setBeforeTile({ x, y }: gridPos, tile: tile): BeforeTile {

        if (!this.grid[x]) {
            this.grid[x] = [];
        }
        let before = this.getTile({ x, y });
        if (before == tile) {
            return undefined;
        }
        this.grid[x][y] = tile;

        if (tile != 'e') {
            // Update X Boundaries
            if (x > this.gridXMax) this.gridXMax = x;
            if (x < this.gridXMin) this.gridXMin = x;

            // Update Y Boundaries
            if (y > this.gridYMax) this.gridYMax = y;
            if (y < this.gridYMin) this.gridYMin = y;
        }

        return { pos: { x, y }, tile: before };

    }

    public beforeExpandBorder(pos: gridPos): BeforeTile[] {

        let out: BeforeTile[] = [];
        // place the 'e'
        let a = this.getAllInRange(pos, PLACE_RANGE);
        a.forEach((pos) => {
            if (this.getTile(pos) == undefined) {
                let add = this.setBeforeTile(pos, 'e');
                if (add != undefined) {
                    out.push(add);
                }
            }
        });
        return out;
    }

    public undoBeforeTile(beforeTile: BeforeTile) {
        if (beforeTile == undefined) {
            return;
        }
        this.forrecesetTile(beforeTile.pos, beforeTile.tile);
    }

    public undoBeforeTileList(beforeTile: BeforeTile[]) {

        for (let i = 0; i < beforeTile.length; i++) {
            this.undoBeforeTile(beforeTile[i])

        }
    }



}

