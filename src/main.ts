import { borderSize } from "./const.js";
import { Game } from "./game.js";
import { addListener, pointerX, pointerY } from "./listener.js";
import { forGrid } from "./text.js";
import { gridType } from "./type.js";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export let gridx = 500;
export let gridy = 500;

export let gridRadius = 100;

export let game: Game;

export function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



function main() {
    let canvasTemp = document.querySelector("canvas");
    if (canvasTemp == undefined) return;
    canvas = canvasTemp;
    let ctxTemp = canvas.getContext("2d");
    if (ctxTemp == undefined) return;
    ctx = ctxTemp;

    console.log("test");


    

    gridx = window.innerWidth / 2;
    gridy = window.innerHeight / 2;

    game = new Game();

    addListener();

    resizeCanvas();

    requestAnimationFrame(draw);
}


function draw() {


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, gridx, gridy, gridRadius);

    requestAnimationFrame(draw);

}

function drawGrid(ctx: CanvasRenderingContext2D, xg: number, yg: number, radius: number) {

    let distance = radius * Math.sqrt(3);
    let distancedown = radius * 1.5;
    let distenceh = distance / 2;
    forGrid(game.grid, (x, y, e) => {



        let c:string;
        if (e == "e") {
            c = "black";
        } else if (e == "b") {
            c = "blue";
        } else {
            c = "red"
        }
        drawHex(ctx, xg + distance * x + distenceh * y, yg + distancedown * y, radius, c)

    })

    //drawHex(ctx, xg + distance * pointerX + distenceh * pointerY, yg + distancedown * pointerY, radius, "green")
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

main();