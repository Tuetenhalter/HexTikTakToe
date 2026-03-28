import { tile, gridPos, gridType, player } from "./type"





export class Game {

    grid: gridType;
    whichTurn: player;
    turnNumber: 0 | 1;


    constructor() {
        this.grid = [['e']];
        this.whichTurn = 'r';
        this.turnNumber = 1;
    }

    public placeTile(pos: gridPos) {
        let t = this.getTile(pos)
        if (t != 'e') {
            return;
        }

        this.setTile(pos, this.whichTurn);
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


        let a = this.getAllInRange(pos, 8);
        a.forEach((pos) => {
            if(this.getTile(pos) == undefined){
                this.setTile(pos, 'e');
            }
        })
    }


    public setTile({ x, y }: gridPos, field: tile) {
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

    public getAllInRange(pos: gridPos, range: number):gridPos[] {
        let out: gridPos[] = [];
        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                if(Math.abs(i+j) > range) continue
                out.push({x:pos.x+i, y:pos.y+j});
            }
        }

        return out
    }

}
