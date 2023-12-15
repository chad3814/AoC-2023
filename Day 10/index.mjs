import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n').filter(l => l.length > 0);
    const maze = [];
    let startX = -1;
    let startY = -1;
    let x;
    let y = 0;
    for (const line of lines) {
        x = line.indexOf('S');
        if (x !== -1) {
            startX = x;
            startY = y;
        }
        y++;
        maze.push(line.split(''));
    }
    return {maze, startX, startY};
}

function followMaze(maze, distances, x, y, count) {
    let done = false;
    while (!done) {
        distances[y][x] = count;
        switch (maze[y][x]) {
            case '|':
                // vertical pipe, check above and below
                if (distances[y-1][x] === -1) {
                    y--;
                    count++;
                } else if (distances[y + 1][x] === -1) {
                    y++;
                    count++;
                } else done = true;
                break;
            case '-':
                // horizontal pipe, check left and right
                if (distances[y][x - 1] === -1) {
                    x--;
                    count++;
                } else if (distances[y][x + 1] === -1) {
                    x++;
                    count++;
                } else done = true;
                break;
            case 'L':
                // above to right
                if (distances[y - 1][x] === -1) {
                    y--;
                    count++;
                } else if (distances[y][x + 1] === -1) {
                    x++;
                    count++;
                } else done = true;
                break;
            case '7':
                // left to below
                if (distances[y][x - 1] === -1) {
                    x--;
                    count++;
                } else if (distances[y + 1][x] === -1) {
                    y++;
                    count++;
                } else done = true;
                break;
            case 'J':
                // above to left
                if (distances[y - 1][x] === -1) {
                    y--;
                    count++;
                } else if (distances[y][x - 1] === -1) {
                    x--;
                    count++;
                } else done = true;
                break;
            case 'F':
                // right to below
                if (distances[y][x + 1] === -1) {
                    x++;
                    count++;
                } else if (distances[y + 1][x] === -1) {
                    y++;
                    count++;
                } else done = true;
                break;
            default:
                throw new Error('invalid pipe');
        }
    }
    console.log('finished the loop');
    // for (const row of distances) {
    //     console.log(row.map(c => (""+c).padStart(5, '.')).join(' '));
    // }
    return count + 1;
}

function part1(data) {
    const {maze, startX, startY} = data;
    const distances = [];
    for (const row of maze) {
        distances.push(new Array(row.length).fill(-1));
    }
    distances[startY][startX] = 0;
    // in the data the two pipe connects are above and below
    const distance = followMaze(maze, distances, startX, startY + 1, 1);
    console.log(`furthest is ${distance >> 1}`);
}

function part2(data) {
    const {maze, startX, startY} = data;
}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
