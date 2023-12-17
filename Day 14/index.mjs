import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
//     const input = `O....#....
// O.OO#....#
// .....##...
// OO.#O....O
// .O.....O#.
// O.#..O.#.#
// ..O..#O..O
// .......O..
// #....###..
// #OO..#....`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const grid = lines.map(l => l.split(''));
    return grid;
}

function roll(grid) {
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] === '.') {
                let i;
                for(i = y + 1; i < grid.length; i++) {
                    if (grid[i][x] !== '.') {
                        break;
                    }
                }
                if (i < grid.length && grid[i][x] === 'O') {
                    grid[i][x] = '.';
                    grid[y][x] = 'O';
                }
            }
        }
    }
}

function weigh(grid) {
    let total = 0;
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (const cell of row) {
            if (cell === 'O') total += (grid.length - y);
        }
    }
    return total;
}

function part1(grid) {
    roll(grid);
    const total = weigh(grid);
    console.log(`total is ${total}`);
}

function rotate(grid) {
    const newGrid = new Array(grid[0].length);
    for (let y = 0; y < newGrid.length; y++) {
        newGrid[y] = new Array(grid.length);
    }
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            newGrid[x][grid.length - y - 1] = grid[y][x];
        }
    }
    return newGrid;
}

function dump(grid) {
    for (const row of grid) {
        console.log(row.join(''));
    }
}
function cycle(grid) {
    for(let i = 0; i < 4; i++) {
        roll(grid);
        grid = rotate(grid);
    }
    return grid;
}

function part2(grid) {
    const map = new Map();
    map.set(grid.flat().join(''), 0);
    const cycles = 1000000000;
    let x;
    for (x = 1; x <= cycles; x++) {
        grid = cycle(grid);
        const key = grid.flat().join('');
        if (map.has(key)) {
            break;
        }
        map.set(key, x);
    }
    const pos = map.get(grid.flat().join(''));
    console.log(`${x} repeats ${pos}, so a loop of ${x - pos} with ${cycles - pos} left`);
    const len = x - pos;
    const rem = (cycles - pos) % len;
    for (x = 0; x < rem; x++) grid = cycle(grid);
    dump(grid);
    console.log(`weight is ${weigh(grid)}`);
}

async function main() {
    let grid = await parse();
    part1(grid);
    grid = await parse();
    part2(grid);
}

main();
