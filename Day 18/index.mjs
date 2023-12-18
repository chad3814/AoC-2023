import { Dir } from 'fs';
import fs from 'fs/promises';

async function parse() {
    // const input = await fs.readFile('./input.txt', 'utf-8');
    const input =
`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const plan = [];
    for (const line of lines) {
        const [direction, length, color] = line.split(' ');
        plan.push({direction, length: parseInt(length, 10), color});
    }
    return plan;
}

const Directions = {
    NORTH: [0, -1],
    EAST: [1, 0],
    SOUTH: [0, 1],
    WEST: [-1, 0],
};
function isCorner(pit, x, y) {
    if (pit[y][x] === '.') return false;
    const deltas = [];
    for (const [direction, delta] of Object.entries(Directions)) {
        const [dx, dy] = delta;
        const newX = x + dx;
        const newY = y + dy;
        if (
            newX >= 0 && newX < pit[0].length &&
            newY >= 0 && newY < pit.length &&
            pit[newY][newX] === '#'
        ) {
            deltas.push(delta);
        }
    }
    if (deltas.length !== 2) {
        throw new Error('bad track');
    }
    const combine = deltas.reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
    if (combine[0] === 0 && combine[1] === 0) return false;
    return true;
}
function order(points) {
    let useX = false;
    let prev = points.shift();
    const ordered = [prev];
    while (points.length > 0) {
        if (useX) {
            const potential = points.filter(([x]) => x === prev[0]);
            if (potential.length === 0) {
                throw new Error('no potential');
            }
            potential.sort((a, b) => a[1] - b[1]);
            const pick = potential[0];
            ordered.push(pick);
            const index = points.findIndex(p => p[0] === pick[0] && p[1] === pick[1]);
            if (index === -1) {
                throw new Error('failed to find potential');
            }
            points.splice(index, 1);
            useX = !useX;
        } else {
            console.log(`find y = ${prev[1]} from ${points.join(' - ')}`);
            const potential = points.filter(([_, y]) => y === prev[1]);
            if (potential.length === 0) {
                throw new Error('no potential');
            }
            potential.sort((a, b) => a[0] - b[0]);
            const pick = potential[0];
            ordered.push(pick);
            const index = points.findIndex(p => p[0] === pick[0] && p[1] === pick[1]);
            if (index === -1) {
                throw new Error('failed to find potential');
            }
            points.splice(index, 1);
            useX = !useX;
        }
    }
    return ordered;
}
function part1(plan) {
    let pit = [['#']];
    let x = 0;
    let y = 0;
    let width = 1;
    let height = 1;
    for (const {direction, length} of plan) {
        switch (direction) {
            case 'U':
                for (let i = 0; i < length; i++) {
                    if (y === 0) {
                        const row = new Array(width).fill('.');
                        pit.unshift(row);
                        y++;
                        height++;
                    }
                    y--;
                    pit[y][x] = '#';
                }
                break;
            case 'D':
                for (let i = 0; i < length; i++) {
                    if (y === height - 1) {
                        const row = new Array(width).fill('.');
                        pit.push(row);
                        height++;
                    }
                    y++;
                    pit[y][x] = '#';
                }
                break;
            case 'L':
                for (let i = 0; i < length; i++) {
                    if (x === 0) {
                        for (let j = 0; j < height; j++) {
                            pit[j].unshift('.');
                        }
                        x++;
                        width++;
                    }
                    x--;
                    pit[y][x] = '#';
                }
                break;
            case 'R':
                for (let i = 0; i < length; i++) {
                    if (x === width - 1) {
                        for (let j = 0; j < height; j++) {
                            pit[j].push('.');
                            width++;
                        }
                    }
                    x++;
                    pit[y][x] = '#';
                }
                break;
        }
    }
    console.log(`outline`);
    for (const row of pit) {
        console.log(row.join(''));
    }
    let points = [];
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            if (isCorner(pit, i, j)) {
                points.push([i, j]);
            }
        }
    }
    points = order(points);
    points.push(points[0]);
    console.log(`points: ${JSON.stringify(points)}`);
    let sum = 0;
    for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i -1];
        const [x2, y2] = points[i];
        sum += (x1 * y2) - (y1 * x2);
    }
    const area = Math.abs(sum / 2);
    console.log(`size: ${area}`);
}

function part2(data) {

}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
