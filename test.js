let grid = [];


for (let x = -1; x < 2; x++) {
    grid[x] = [];
    for (let y = -1; y < 2; y++) {
        grid[x][y] = [];
        for (let z = -1; z < 2; z++) {

            grid[x][y][z] = 1;
        }
    }
}



for (const x in grid) {
    for (const y in grid[x]) {
        for (const z in grid[x][y]) {
            console.log(x + ", " + y + ", " + z);
        }



    }
}

for (const key in object) {
    
    
    const element = object[key];
    
    
}

Object.hasOwn

console.log("moin");



