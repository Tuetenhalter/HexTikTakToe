import { MAXGRIDRADIUS, MINGRIDRADIUS, TOCUHZOOMMULRI, WHEELZOOMMULTI } from "./const.js";
import { canvas, game, gridRadius, gridx, gridy, resizeCanvas, setGridPos, setGridRadius } from "./main.js"
import { gridPos } from "./type.js";



let mouseDown = false;

let mouseDownX: number;
let mouseDownY: number;

let mouseDownGridX: number;
let mouseDownGridY: number;

let touchDown = false;

let touchDownX: number;
let touchDownY: number;

let touchDownGridX: number;
let touchDownGridY: number;

let touch2Distance: number;

let touch2middelx: number;
let touch2middely: number;

export let pointerX = 0;
export let pointerY = 0;




export function addListener() {

    window.addEventListener("resize", resizeListener)

    canvas.addEventListener("click", clickListener)
    document.addEventListener('mousedown', mouseDownListener);
    document.addEventListener('mouseup', mouseUpListener);
    document.addEventListener("mousemove", mouseMoveListener);
    document.addEventListener("wheel", wheelListener);
    document.addEventListener("touchstart", touchstartListener);
    document.addEventListener("touchend", touchendListerner);
    document.addEventListener("touchmove", touchMoveListener);

    canvas.addEventListener("touchstart", (event) => {
        if (event.touches.length > 1) {
            event.preventDefault(); // Prevents multi-touch zooming
        }
    });
}

function resizeListener() {

    console.log("moin");
    
    
    resizeCanvas();
}

function clickListener(event: PointerEvent){
    let pos = point_to_Hex(event.x, event.y);
    game.placeTile(pos);
}




function mouseDownListener(event: MouseEvent) {

    mouseDown = true;

    mouseDownX = event.x;
    mouseDownY = event.y;

    mouseDownGridX = gridx;
    mouseDownGridY = gridy;
}

function mouseUpListener(event: MouseEvent) {

    mouseDown = false;
}

function mouseMoveListener(event: MouseEvent) {
    if (mouseDown) {
        let changeX = event.x - mouseDownX;
        let changeY = event.y - mouseDownY;


        let newX = mouseDownGridX + changeX;
        let newY = mouseDownGridY + changeY;

        setGridPos(newX, newY);
    }

    let { x, y } = point_to_Hex(event.x, event.y);
    pointerX = x;
    pointerY = y;
}

function wheelListener(event: WheelEvent) {

    let d = event.deltaY * WHEELZOOMMULTI;

    let oldRadius = gridRadius;
    setGridRadius(gridRadiusMinMax(gridRadius * (1 + d)));

    d = 1 - oldRadius / gridRadius;

    let newX = gridx + (gridx - event.x) * d;
    let newY = gridy + (gridy - event.y) * d;

    setGridPos(newX, newY);
}

function touchstartListener(event: TouchEvent) {
    console.log(event.touches.length);

    if (event.touches.length == 1) {
        touchDown = true;

        touchDownX = event.touches[0].pageX;
        touchDownY = event.touches[0].pageY;

        touchDownGridX = gridx;
        touchDownGridY = gridy;
    }

    if (event.touches.length == 0) {
        touchDown = false;
        console.log("off");
    }

    if (event.touches.length == 2) {
        touch2Distance = calcTouchDistance(event.touches);
        let { x, y } = calcTouchMiddle(event.touches);
        touch2middelx = x;
        touch2middely = y;
    }


    if (event.touches.length > 1) {
        event.preventDefault(); // Prevents multi-touch zooming
    }
}

function touchendListerner(event: TouchEvent) {
    console.log(event.touches.length);
    if (event.touches.length == 0) {
        touchDown = false;
        console.log("off");
    }

    if (event.touches.length == 1) {
        touchDown = true;

        touchDownX = event.touches[0].pageX;
        touchDownY = event.touches[0].pageY;

        touchDownGridX = gridx;
        touchDownGridY = gridy;
    }
}

function touchMoveListener(event: TouchEvent) {

    if (event.touches.length == 1) {
        let x = event.touches[0].pageX;
        let y = event.touches[0].pageY;
        if (touchDown) {

            let changeX = x - touchDownX;
            let changeY = y - touchDownY;


            let newX = touchDownGridX + changeX;
            let newY = touchDownGridY + changeY;

            setGridPos(newX, newY);
        }

        let { x: px, y: py } = point_to_Hex(x, y);
        pointerX = px;
        pointerY = py;
    }

    if (event.touches.length == 2) {
        let d = (calcTouchDistance(event.touches) - touch2Distance) * TOCUHZOOMMULRI;

        console.log(d);

        let oldRadius = gridRadius;
        setGridRadius(gridRadiusMinMax(gridRadius * (1 + d)));

        d = 1 - oldRadius / gridRadius;

        let { x, y } = calcTouchMiddle(event.touches);

        console.log("x: " + x);
        console.log("y: " + y);



        let newX = gridx + (gridx - x) * d + x - touch2middelx;
        let newY = gridy + (gridy - y) * d + y - touch2middely;

        setGridPos(newX, newY);

        touch2Distance = calcTouchDistance(event.touches);
        touch2middelx = x;
        touch2middely = y;

    }
}

function calcTouchDistance(touches: TouchList) {

    let dx = touches[0].pageX - touches[1].pageX;
    let dy = touches[0].pageY - touches[1].clientY;

    return Math.sqrt(dx * dx + dy * dy);
}

function calcTouchMiddle(touches: TouchList) {
    let x = (touches[0].pageX + touches[1].pageX) / 2;
    let y = (touches[0].pageY + touches[1].pageY) / 2;
    return { x, y };
}




// ######################################################################################################

function gridRadiusMinMax(r: number) {
    return Math.min(MAXGRIDRADIUS, Math.max(MINGRIDRADIUS, r));
}


function point_to_Hex(x: number, y: number) {

    // invert the scaling and transfomation
    let x2 = (x - gridx) / gridRadius
    let y2 = (y - gridy) / gridRadius

    // cartesian to hex
    let q = (Math.sqrt(3) / 3 * x2 - 1. / 3 * y2)
    let r = (2. / 3 * y2)
    return round_Hex_Axial({ x: q, y: r });

}

type Hex_Cube = { x: number, y: number, z: number }



function round_Hex_Axial(frac: gridPos): gridPos {
    return cube_to_axial(round_Hex_Cube(axial_to_cube(frac)));

}

function round_Hex_Cube(frac: Hex_Cube): Hex_Cube {
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

function cube_to_axial(cube: Hex_Cube): gridPos {
    return { x: cube.x, y: cube.y }
}

function axial_to_cube(hex: gridPos): Hex_Cube {
    var q = hex.x
    var r = hex.y
    var s = -q - r
    return { x: q, y: r, z: s }
}
