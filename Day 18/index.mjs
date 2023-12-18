import { Dir } from 'fs';
import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
//     const input =
// `R 6 (#70c710)
// D 5 (#0dc571)
// L 2 (#5713f0)
// D 2 (#d2c081)
// R 2 (#59c680)
// D 2 (#411b91)
// L 5 (#8ceee2)
// U 2 (#caa173)
// L 1 (#1b58a2)
// U 2 (#caa171)
// R 2 (#7807d2)
// U 3 (#a77fa3)
// L 2 (#015232)
// U 2 (#7a21e3)`;
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

function updatePoints(points, delta) {
    for (let i = 0; i < points.length; i++) {
        points[i][0] += delta[0];
        points[i][1] += delta[1];
    }
}

function part1(plan) {
    let pit = [['#']];
    let x = 0;
    let y = 0;
    let width = 1;
    let height = 1;
    const points = [[0, 0]];
    let distance = 0;
    for (const {direction, length} of plan) {
        switch (direction) {
            case 'U':
                for (let i = 0; i < length; i++) {
                    if (y === 0) {
                        const row = new Array(width).fill('.');
                        pit.unshift(row);
                        y++;
                        height++;
                        updatePoints(points, Directions.SOUTH);
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
                        updatePoints(points, Directions.WEST);
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
        points.push([x, y]);
        distance += length;
    }
    // console.log(`outline`);
    // for (const row of pit) {
    //     console.log(row.join(''));
    // }
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
    const internalPoints = area + 1 - (distance >> 1);
    console.log(`hole has a total volume of ${internalPoints + distance}`);
}

function part2(data) {

}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
