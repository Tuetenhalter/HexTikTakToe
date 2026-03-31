import { EVAL_LINE_6, EVAL_LINE_6_MIN, EVAL_LINE_MULTI, PLACE_RANGE } from "./const.js";
import { Game } from "./game.js";
import { forGrid } from "./idk.js";
import { gridPos, Move, MoveEval, player, tile } from "./type.js";




export let bestMove: Move;
export let count: number;
export let time: number;

export function startMinMax(game: Game, depth: number) {

    count = 0;
    let before = Date.now();

    let botGame = new BotGame(game);

    minMax(botGame, depth, -Infinity, Infinity, true);

    time = Date.now() - before;
    console.log("count: " + count);
    console.log("time: " + time + "ms");
}

export function minMax(game: BotGame, depth: number, alpha: number, beta: number, isRoot: boolean): number {
    count++;
    // if (count % 1000 == 0) {
    //     console.log(count);

    // }
    if (depth == 0) {
        return game.eval;
    }

    if (Math.abs(game.eval) > EVAL_LINE_6_MIN) {
        return game.eval
    }



    let allMoves = game.allPossibleMove();

    // simple sort for alpha betta
    allMoves.sort((m1, m2) => {
        let a = Math.abs(m1[0].x) + Math.abs(m1[0].y) + Math.abs(m1[1].x) + Math.abs(m1[1].y);
        let b = Math.abs(m2[0].x) + Math.abs(m2[0].y) + Math.abs(m2[1].x) + Math.abs(m2[1].y);
        return a - b;
    });

    let bestPos = -1;


    for (let i = 0; i < allMoves.length; i++) {

        const [move1, move2] = allMoves[i];

        let gridXMin = game.gridXMin;
        let gridXMax = game.gridXMax;
        let gridYMin = game.gridYMin;
        let gridYMax = game.gridYMax;

        let beforeEval = game.eval;

        // make move
        let before1 = game.setBeforeTileFastEval(move1, game.whichTurn);
        let before2 = game.setBeforeTileFastEval(move2, game.whichTurn);
        let beforeList1 = game.beforeExpandBorder(move1);
        let beforeList2 = game.beforeExpandBorder(move2);

        game.eval = -game.eval;

        game.whichTurn = game.whichTurn == 'b' ? 'r' : 'b';

        let score = -minMax(game, depth - 1, -beta, -alpha, false);

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
        game.eval = beforeEval;


        if (score >= beta) return beta; // Skip the rest of this branch
        if (score > alpha) {
            alpha = score;
            bestPos = i;
        }
    }

    if (isRoot && bestPos !== -1) {
        bestMove = [allMoves[bestPos][0], allMoves[bestPos][1]];
    } 2

    return alpha;
}


type BeforeTile = { pos: gridPos, tile: tile | undefined };


export class BotGame extends Game {

    eval: number;

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
        this.eval = this.evaluateBoard();
    }

    public setBeforeTile({ x, y }: gridPos, tile: tile): BeforeTile | undefined {

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

    public undoBeforeTile(beforeTile: BeforeTile | undefined) {
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

    public setBeforeTileFastEval(pos: gridPos, tile: tile): BeforeTile | undefined {

        let evalbefore = this.evaluatePos(pos);

        let out = this.setBeforeTile(pos, tile);

        if (out == undefined) return undefined;

        let evalafter = this.evaluatePos(pos);

        this.eval = this.eval - evalbefore + evalafter;

        if (Math.abs(this.eval) > EVAL_LINE_6_MIN) {
            this.eval = this.eval > 0 ? EVAL_LINE_6 : -EVAL_LINE_6;
        }

        return out;
    }

    public setBeforeTileFastEvalDebug(pos: gridPos, tile: tile): BeforeTile | undefined {
        let erroebefore = false;

        if (this.eval != this.evaluateBoard()) {
            console.log("erroe before");
            erroebefore = true;
        }

        let evalbefore = this.evaluatePos(pos);

        let out = this.setBeforeTile(pos, tile);

        if (out == undefined) return undefined;

        let evalafter = this.evaluatePos(pos);

        this.eval = this.eval - evalbefore + evalafter;

        if (Math.abs(this.eval) > EVAL_LINE_6_MIN) {
            this.eval = this.eval > 0 ? EVAL_LINE_6 : -EVAL_LINE_6;
        }

        let actualeval = this.evaluateBoard();


        // console.log();
        // console.log("eval: " + this.eval);
        // console.log("eval: " + actualeval);

        if (this.eval != actualeval && !erroebefore) {
            console.log("error");
        }

        return out;
    }



    public evaluatePos(pos: gridPos, p1 = this.whichTurn): number {
        let score = 0;
        const p2 = p1 === 'r' ? 'b' : 'r';

        const directions = [
            { dx: 1, dy: 0 },  // Axis 1: Horizontal
            { dx: 0, dy: 1 },  // Axis 2: Vertical
            { dx: 1, dy: -1 }  // Axis 3: Diagonal
        ];

        // We expand the search area slightly beyond the current pieces
        // to find potential empty spots that could complete a line.
        for (const { dx, dy } of directions) {
            for (let i = 0; i < 6; i++) {
                const x = -dx * i + pos.x;
                const y = -dy * i + pos.y;

                let a = this.evaluateLine(x, y, dx, dy, p1);
                let b = this.evaluateLine(x, y, dx, dy, p2) * EVAL_LINE_MULTI;
                // if (a != 0)
                //     console.log("a: " + a);
                // if (b != 0)
                //     console.log("b: " + b);


                score += a;
                score -= b;
            }
        }

        if (Math.abs(score) > EVAL_LINE_6_MIN) {
            return score > 0 ? EVAL_LINE_6 : -EVAL_LINE_6;
        }

        return score;
    }

}