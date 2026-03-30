import { bestMove, startMinMax } from "./bot.js";
import { LINE_TO_WIN, MAX_DEPTH, PLACE_RANGE } from "./const.js";
import { copyGrid, forGrid } from "./idk.js";
import { game } from "./main.js";
import { GameState, gridPos, gridType, Move, player, tile } from "./type.js";





export class Game {

    grid: gridType;
    whichTurn: player;
    turnNumber: 0 | 1;

    gridXMin: number;
    gridXMax: number;

    gridYMin: number;
    gridYMax: number;

    history: GameState[];
    historyPos: number;


    constructor() {
        this.grid = [['e']];
        this.whichTurn = 'r';
        this.turnNumber = 1;
        this.gridXMin = 0;
        this.gridXMax = 0;
        this.gridYMin = 0;
        this.gridYMax = 0;

        this.history = [];
        this.historyPos = -1;

        this.saveToHistory();
    }

    public placeTile(pos: gridPos) {
        let t = this.getTile(pos)
        if (t != 'e' && t != 't') {
            return;
        }

        this.setTile(pos, this.whichTurn);

        console.log("eval: " + this.evaluateBoard());

        // change Turn
        if (this.turnNumber == 0) {
            this.turnNumber = 1;
        } else {
            if (this.whichTurn == "b") {
                this.whichTurn = "r";
            } else {
                this.whichTurn = "b"
            }
            this.turnNumber = 0;
        }

        let win = this.checkWin();

        if (win != undefined) {
            console.log("win: " + win);
            //alert("win: " + win)

        }

        this.expandBorder(pos);

        this.saveToHistory();
        if(this.whichTurn == 'b' && this.turnNumber == 0){
            startMinMax(game, MAX_DEPTH);
            const [move1, move2] = bestMove;
            this.placeTile(move1);
            this.placeTile(move2);
        }
    }

    public undoMove() {
        if (this.historyPos == 0) {
            return;
        }

        this.historyPos--;
        let lastGameState = this.history[this.historyPos];
        this.loadGameState(lastGameState);
    }

    public redoMove() {
        if (this.historyPos == this.history.length - 1) {
            return;
        }

        this.historyPos++;
        let lastGameState = this.history[this.historyPos];
        this.loadGameState(lastGameState);
    }

    public saveToHistory() {

        // remove everything after pos
        if (this.historyPos < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyPos + 1);
        }

        this.historyPos++;
        this.history[this.historyPos] = this.createGameState();
    }

    public expandBorder(pos: gridPos) {
        // place the 'e'
        let a = this.getAllInRange(pos, PLACE_RANGE);
        a.forEach((pos) => {
            if (this.getTile(pos) == undefined) {
                this.setTile(pos, 'e');
            }
        });

    }


    public setTile({ x, y }: gridPos, field: tile) {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }
        this.grid[x][y] = field;

        if (field == 'e') {
            return;
        }
        // Update X Boundaries
        if (x > this.gridXMax) this.gridXMax = x;
        if (x < this.gridXMin) this.gridXMin = x;

        // Update Y Boundaries
        if (y > this.gridYMax) this.gridYMax = y;
        if (y < this.gridYMin) this.gridYMin = y;
    }

    public forrecesetTile({ x, y }: gridPos, field: tile) {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }
        this.grid[x][y] = field;
    }


    public getTile({ x, y }: gridPos): tile | undefined {
        if (!this.grid[x]) {
            return undefined;
        }
        return this.grid[x][y];
    }

    public getAllInRange(pos: gridPos, range: number): gridPos[] {
        let out: gridPos[] = [];
        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                if (Math.abs(i + j) > range) continue
                out.push({ x: pos.x + i, y: pos.y + j });
            }
        }

        return out
    }

    public checkWin(): player | undefined {
        let linecount = 0;
        let curTile: tile | undefined;

        // search the y axes
        for (let x = this.gridXMin; x <= this.gridXMax; x++) {
            linecount = 0;
            curTile = undefined;
            for (let y = this.gridYMin; y <= this.gridYMax; y++) {
                const e = this.getTile({ x, y });

                if (e == curTile) {
                    linecount++;

                    if (linecount == LINE_TO_WIN) {
                        if (curTile == 'b' || curTile == 'r') {
                            return curTile;
                        }
                    }
                } else {
                    curTile = e;
                    linecount = 1;
                }
            }
        }

        // seach the x axes3
        for (let y = this.gridYMin; y <= this.gridYMax; y++) {
            linecount = 0;
            curTile = undefined;
            for (let x = this.gridXMin; x <= this.gridXMax; x++) {
                const e = this.getTile({ x, y });
                if (e == curTile) {
                    linecount++;
                    if (linecount == LINE_TO_WIN) {
                        if (curTile == 'b' || curTile == 'r') {
                            return curTile;
                        }
                    }
                } else {
                    curTile = e;
                    linecount = 1;
                }
            }
        }


        let l = 0;
        let lMax = Math.min(this.gridXMax - this.gridXMin, this.gridYMax - this.gridYMin) + 1;
        for (let y = this.gridYMin; y <= this.gridYMax; y++) {
            l++;
            linecount = 0;
            curTile = undefined;
            for (let i = 0; i < Math.min(l, lMax); i++) {
                let pos = { x: this.gridXMin + i, y: y - i, };
                const e = this.getTile(pos);

                if (e == curTile) {
                    linecount++;
                    if (linecount == LINE_TO_WIN) {
                        if (curTile == 'b' || curTile == 'r') {
                            return curTile;
                        }
                    }
                } else {
                    curTile = e;
                    linecount = 1;
                }

            }
        }

        l = this.gridXMax - this.gridXMin + 1;
        for (let x = this.gridXMin + 1; x <= this.gridXMax; x++) {
            l--;
            linecount = 0;
            curTile = undefined;
            for (let i = 0; i < Math.min(l, lMax); i++) {
                let pos = { x: x + i, y: this.gridYMax - i, };
                const e = this.getTile(pos);

                // this.forrecesetTile(pos, "t");
                if (e == curTile) {
                    linecount++;
                    if (linecount == LINE_TO_WIN) {
                        if (curTile == 'b' || curTile == 'r') {
                            return curTile;
                        }
                    }
                } else {
                    curTile = e;
                    linecount = 1;
                }

            }
        }
        return undefined;
    }

    public createGameState(): GameState {
        return {
            grid: copyGrid(this.grid),
            whichTurn: this.whichTurn,
            turnNumber: this.turnNumber,

            gridXMin: this.gridXMin,
            gridXMax: this.gridXMax,

            gridYMin: this.gridYMin,
            gridYMax: this.gridYMax
        }
    }

    public loadGameState(gameState: GameState) {

        this.whichTurn = gameState.whichTurn;
        this.turnNumber = gameState.turnNumber;

        this.gridXMin = gameState.gridXMin;
        this.gridXMax = gameState.gridXMax;
        this.gridYMin = gameState.gridYMin;
        this.gridYMax = gameState.gridYMax;

        this.grid = copyGrid(gameState.grid);
    }

    public allPossibleMove(): Move[] {

        let emptyTiles: gridPos[] = [];
        forGrid(this.grid, (x, y, e) => {
            if (this.getTile({ x, y }) != 'e') {
                return;
            }
            emptyTiles.push({ x, y });

        })


        let out: Move[] = [];
        for (let i = 0; i < emptyTiles.length; i++) {
            for (let j = i + 1; j < emptyTiles.length; j++) {
                out.push([emptyTiles[i], emptyTiles[j]]);
            }
        }


        return out;
    }

     public evaluateBoard(): number {
        let score = 0;
        const p1 = this.whichTurn;
        const p2 = p1 === 'r' ? 'b' : 'r';

        const directions = [
            { dx: 1, dy: 0 },  // Axis 1: Horizontal
            { dx: 0, dy: 1 },  // Axis 2: Vertical
            { dx: 1, dy: -1 }  // Axis 3: Diagonal
        ];

        // We expand the search area slightly beyond the current pieces
        // to find potential empty spots that could complete a line.
        for (let x = this.gridXMin - 5; x <= this.gridXMax; x++) {
            for (let y = this.gridYMin - 5; y <= this.gridYMax; y++) {
                for (const { dx, dy } of directions) {
                    score += this.evaluateLine(x, y, dx, dy, p1);
                    score -= this.evaluateLine(x, y, dx, dy, p2) * 1.2; // Block opponent more aggressively
                }
            }
        }

        if(score > 1000000){
            return 10000000;
        }

        return score;
    }

    private evaluateLine(startX: number, startY: number, dx: number, dy: number, player: tile): number {
        let count = 0;
        const opponent = player === 'r' ? 'b' : 'r';

        // Look at a window of 6 tiles
        for (let i = 0; i < 6; i++) {
            const t = this.getTile({ x: startX + (dx * i), y: startY + (dy * i) });

            if (t === opponent) return 0;

            if (t === player) {
                count++;
            }
        }

        switch (count) {
            case 6: return 10000000;
            case 5: return 500;
            case 4: return 500;
            case 3: return 50;
            case 2: return 5;
            default: return 0;
        }
    }
}

