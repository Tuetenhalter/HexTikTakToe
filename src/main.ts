import { bestMove, moveScore } from "./bot.js";
import { borderSize, COLOR_BLUE, COLOR_BLUE_HOVER, COLOR_EMPTY, COLOR_EMPTY_HOVER, COLOR_RED, COLOR_RED_HOVER, COLOR_TEST, COLOR_TEST_HOVER, START_GRID_RADIUS } from "./const.js";
import { Game } from "./game.js";
import { forGrid } from "./idk.js";
import { addListener, pointerX, pointerY } from "./listener.js";
import { node } from "./node.js";
import { gridPos } from "./type.js";


export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export let gridx = 500;
export let gridy = 500;

export let gridRadius = START_GRID_RADIUS;

export let game: Game;


let testP: Element;

export let debug: {
    posList: gridPos[]
    posListColor: string[]
} = {
    posList: [],
    posListColor: []
}

export function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



function main() {

    // run with mode?
    if (typeof window === 'undefined') {
        console.log("node");
        node();
        return;

    }

    let canvasTemp = document.querySelector("canvas");
    if (canvasTemp == undefined) return;
    canvas = canvasTemp;

    let ctxTemp = canvas.getContext("2d");
    if (ctxTemp == undefined) return;
    ctx = ctxTemp;

    let testPTemp = document.querySelector("#testP");
    if (testPTemp == undefined) return;
    testP = testPTemp;

    gridx = window.innerWidth / 2;
    gridy = window.innerHeight / 2;

    game = new Game();

    addListener();

    resizeCanvas();

    requestAnimationFrame(draw);
}


export function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, gridx, gridy, gridRadius);


    testP.textContent = "x: " + pointerX + ", y: " + pointerY

    requestAnimationFrame(draw);

}

function drawGrid(ctx: CanvasRenderingContext2D, xg: number, yg: number, radius: number) {

    let distance = radius * Math.sqrt(3);
    let distancedown = radius * 1.5;
    let distenceh = distance / 2;


    function calcX(x: number, y: number) {
        return xg + distance * x + distenceh * y;
    }

    function calcY(y: number) {
        return yg + distancedown * y;
    }

    function calcXY(x: number, y: number) {
        return [calcX(x, y), calcY(y)];
    }

    function d(x: number, y: number, c: string) {
        drawHex(ctx, xg + distance * x + distenceh * y, yg + distancedown * y, radius, c);
    }

    forGrid(game.grid, (x, y, e) => {

        let c: string;
        if (e == "e") {
            c = COLOR_EMPTY;
        } else if (e == "b") {
            c = COLOR_BLUE;
        } else if (e == "r") {
            c = COLOR_RED;
        } else if (e == 't') {
            c = COLOR_TEST
        } else {
            return;
        }
        d(x, y, c);
        // drawHex(ctx, xg + distance * x + distenceh * y, yg + distancedown * y, radius, c)

    })

    //draw best move
    if (bestMove != undefined) {
        d(bestMove[0].x, bestMove[0].y, COLOR_TEST);
        if (bestMove[1] != undefined)
            d(bestMove[1].x, bestMove[1].y, COLOR_TEST);

    }




    // draw pointer
    let colorPointer: string;
    const tilePointer = game.getTile({ x: pointerX, y: pointerY });

    if (tilePointer == "e") {
        colorPointer = COLOR_EMPTY_HOVER;
    } else if (tilePointer == "b") {
        colorPointer = COLOR_BLUE_HOVER;
    } else if (tilePointer == "r") {
        colorPointer = COLOR_RED_HOVER;
    } else {
        colorPointer = COLOR_TEST_HOVER
    }
    if (tilePointer != undefined) {
        d(pointerX, pointerY, colorPointer);
        // drawHex(ctx, xg + distance * pointerX + distenceh * pointerY, yg + distancedown * pointerY, radius, colorPointer)
    } else {
        d(pointerX, pointerY, COLOR_EMPTY_HOVER);

    }


    //draw debug
    debug.posList.forEach(({ x, y }, i) => {
        const c = debug.posListColor[i];
        if (c == undefined) {
            d(x, y, "#f0f8");
        } else {
            d(x, y, c);
        }
    })



    //draw scores

    if (moveScore != undefined) {

        let min = Infinity;
        let max = -Infinity;
        moveScore.forEach(({ score }) => {
            if(max < score){
                max = score;
            }

            if(min > score){
                min = score;
            }
        });


        for (let i = 0; i < Math.min(moveScore.length, 5); i++) {
            const { score, move } = moveScore[i];
            const normalized = Math.log10(score - min)

            const [m1, m2] = move;

            ctx.beginPath();
            ctx.moveTo(calcX(m1.x, m1.y), calcY(m1.y));
            ctx.lineTo(calcX(m2.x, m2.y), calcY(m2.y));

            // 3. Style and render
            ctx.strokeStyle = "yellow"; // Line color
            ctx.lineWidth = normalized;        // Line width
            ctx.stroke();
        }
    }
}



function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fillColor: string = "#61dafb", strokeColor: string = "gray") {

    ctx.beginPath();

    // There are 6 points in a hexagon (0 to 5)
    for (let i = 0; i < 6; i++) {
        // Calculate the angle for each point in radians
        // Adding -Math.PI / 2 rotates it so the "pointy" end is at the top
        const angle = (Math.PI / 3) * i - Math.PI / 2;

        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.closePath(); // Connects the last point back to the first
    ctx.fillStyle = fillColor; // React blue, or any color you like!
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = gridRadius * borderSize;
    ctx.stroke();
}

export function setGridPos(x: number, y: number) {
    gridx = x;
    gridy = y;
}


export function setGridRadius(r: number) {
    gridRadius = r;
}

export function setGame(newGame: Game | undefined) {
    if (newGame == undefined) {
        return;
    }
    game = newGame;
}



main();