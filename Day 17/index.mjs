import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n');
    const data = lines.map(l => l.split(''));
    return data;
}

const FROM_NORTH = 0;
const FROM_EAST = 1;
const FROM_SOUTH = 2;
const FROM_WEST = 3;
let X;
let Y;

async function step(map, been, from=0, x=0, y=0, straightCount=0) {
    const destX = X - 1
    const destY = Y - 1;
    const promises = [];
    been[y * Y + x] = 1;
    switch (from) {
        case FROM_NORTH:
            if (x !== destX && been[y * Y + x + 1] === 0) promises.push(step(map, been.slice(), FROM_WEST, x + 1, y, 0) + map[y][x+1]);
            if (straightCount < 3 && y !== destY && been[(y + 1) * Y + x] === 0) promises.push(step(map, been.slice(), FROM_NORTH, x, y + 1, straightCount + 1)  + map[y+1][x]);
            if (x !== 0 && been[y * Y + x - 1] === 0) promises.push(step(map, been.slice(), FROM_EAST, x - 1, y, 0)  + map[y][x-1]);
            break;
        case FROM_EAST:
            if (y !== destY && been[(y + 1) * Y + x] === 0) promises.push(step(map, been.slice(), FROM_NORTH, x, y + 1, 0) + map[y+1][x]);
            if (straightCount < 3 && x !== 0 && been[y * Y + x - 1] === 0) promises.push(step(map, been.slice(), FROM_EAST, x - 1, y, straightCount + 1) + map[y][x-1]);
            if (y !== 0 && been[(y - 1) * Y + x] === 0) promises.push(step(map, been.slice(), FROM_SOUTH, x, y - 1, 0) + map[y-1][x]);
            break;
        case FROM_SOUTH:
            if (x !== 0 && been[y * Y + x - 1] === 0) promises.push(step(map, been.slice(), FROM_SOUTH, x - 1, y, 0) + map[y][x-1]);
            if (straightCount < 3 && y !== 0 && been[(y - 1) * Y + x] === 0)  promises.push(step(map, been.slice(), FROM_SOUTH, x, y - 1, straightCount + 1) + map[y-1][x]);
            if (x !== destX && been[y * Y + x + 1] === 0) promises.push(step(map, been.slice(), FROM_WEST, x + 1, y, 0) + map[y][x+1]);
            break;
        case FROM_WEST:
            if (y !== 0 && been[(y - 1) * Y + x] === 0) promises.push(step(map, been.slice(), FROM_NORTH, x, y - 1, 0) + map[y-1][x]);
            if (straightCount < 3 && x !== destX && been[y * Y + x + 1] === 0) promises.push(step(map, been.slice(), FROM_WEST, x + 1, y, straightCount + 1) + map[y][x+1]);
            if (y !== destY && been[(y + 1) * Y + x] === 0) promises.push(step(map, been.slice(), FROM_NORTH, x, y + 1, 0) + map[y+1][x]);
            break;
    }
    return Math.min(...Promise.all(promises));
}

async function part1(map) {
    X = map[0].length;
    Y = map.length;
    const been = new Array(Y * X).fill(0);
    been[0] = 1;
    const total = await step(map, been, FROM_NORTH, 0, 0, 0);
    console.log(`the minimum is ${total}`);
}

function part2(map) {

}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
