import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
//     const input =
// `.|...\\....
// |.-.\\.....
// .....|-...
// ........|.
// ..........
// .........\\
// ..../.\\\\..
// .-.-/..|..
// .|....-|.\\
// ..//.|....`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const grid = [];
    for (const line of lines) {
        grid.push(line.split(''));
    }
    return grid;
}

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

function trace(grid, pos) {
    const energized = [];
    for (const row of grid) {
        energized.push(new Array(row.length).fill(0));
    }
    const paths = [pos];
    while (paths.length > 0) {
        const path = paths.pop();
        let {x, y, d} = path;
        while(true) {
            energized[y][x]++;
            // for (const row of energized) {
            //     console.log(row.map(c => (c === 0) ? '.' : '#').join(''));
            // }
            // console.log(x, y, d);

            if (grid[y][x] === '.') {
                if (d === NORTH) {
                    if (y === 0) {
                        break;
                    }
                    y--;
                } else if (d === EAST) {
                    if (x === grid[y].length - 1) {
                        break;
                    }
                    x++;
                } else if (d === SOUTH) {
                    if (y === grid.length - 1) {
                        break;
                    }
                    y++;
                } else {
                    if (x === 0) {
                        break;
                    }
                    x--;
                }
            } else if (grid[y][x] === '/') {
                if (d === NORTH) {
                    if (x === grid[y].length - 1) {
                        break;
                    }
                    x++
                    d = EAST;
                } else if (d === EAST) {
                    if (y === 0) {
                        break;
                    }
                    y--;
                    d = NORTH;
                } else if (d === SOUTH) {
                    if (x === 0) {
                        break;
                    }
                    x--;
                    d = WEST;
                } else if (d === WEST) {
                    if (y === grid.length - 1) {
                        break;
                    }
                    y++;
                    d = SOUTH;
                }
            } else if (grid[y][x] === '\\') {
                if (d === NORTH) {
                    if (x === 0) {
                        break;
                    }
                    x--;
                    d = WEST;
                } else if (d === EAST) {
                    if (y === grid.length - 1) {
                        break;
                    }
                    y++;
                    d = SOUTH;
                } else if (d === SOUTH) {
                    if (x === grid[y].length - 1) {
                        break;
                    }
                    x++;
                    d = EAST;
                } else if (d === WEST) {
                    if (y === 0) {
                        break;
                    }
                    y--;
                    d = NORTH;
                }
            } else if (grid[y][x] === '|') {
                if (energized[y][x] > 1) {
                    break;
                }
                if (d === NORTH) {
                    if (y === 0) {
                        break;
                    }
                    y--;
                } else if (d === SOUTH) {
                    if (y === grid.length - 1) {
                        break;
                    }
                    y++
                } else {
                    if (y !== 0) {
                        paths.push({x, y: y - 1, d: NORTH});
                    }
                    if (y === grid.length - 1) {
                        break;
                    }
                    y++;
                    d = SOUTH;
                }
            } else if (grid[y][x] === '-') {
                if (energized[y][x] > 1) {
                    break;
                }
                if (d === EAST) {
                    if (x === grid[y].length - 1) {
                        break;
                    }
                    x++;
                } else if (d === WEST) {
                    if (x === 0) {
                        break;
                    }
                    x--;
                } else {
                    if (x !== 0) {
                        paths.push({x: x - 1, y, d: WEST});
                    }
                    if (x === grid[y].length - 1) {
                        break;
                    }
                    x++;
                    d = EAST;
                }
            }
        }
    }
    let total = 0;
    for (const row of energized) {
        // console.log(row.map(c => (c>0)?'#':'.').join(''));
        for (const col of row) {
            if (col > 0) total++;
        }
    }
    return total;
}

function part1(grid) {
    const total = trace(grid, {x: 0, y: 0, d: EAST});
    console.log(`${total} energized cells`);
}
function part2(grid) {
    let max = 0;
    for (let y = 0; y < grid.length; y++) {
        let value = trace(grid, {x: 0, y, d: EAST});
        console.log(`from left row ${y}: ${value}`);
        max = Math.max(max, value);
        value = trace(grid, {x: grid[y].length - 1, y, d: WEST});
        console.log(`from right row ${y}: ${value}`);
        max = Math.max(max, value);
    }
    for (let x = 0; x < grid[0].length; x++) {
        let value = trace(grid, {x, y: 0, d: SOUTH});
        console.log(`from top col ${x}: ${value}`);
        max = Math.max(max, value);
        value = trace(grid, {x, y: grid.length - 1, d: NORTH});
        console.log(`from bottom col ${x}: ${value}`);
        max = Math.max(max, value);
    }
    console.log(`max is ${max}`);
}

async function main() {
    const grid = await parse();
    part1(grid);
    part2(grid);
}

main();
