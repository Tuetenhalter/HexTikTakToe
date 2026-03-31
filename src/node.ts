import { startMinMax, count, time } from "./bot.js";
import { TEST_CASE, MAX_DEPTH } from "./const.js";
import { Game } from "./game.js";
import { setGame, game } from "./main.js";

export function node() {
    runTest();
}



export function runTest() {


    let newGame = Game.fromString(TEST_CASE);
    if (newGame == undefined) return;
    setGame(newGame);

    let out = "";

    for (let i = 1; i <= MAX_DEPTH; i++) {
        console.log("Depth: " + i);
        startMinMax(game, i);

        out += "- Depth: " + i + "\n";
        out += "\t- Count: " + count + "\n";
        out += "\t- Time: " + time + "ms\n";

        console.log(out);

    }

    console.log(out);
}