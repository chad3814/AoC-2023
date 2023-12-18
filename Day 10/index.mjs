import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
//     const input = `
// ..........
// .S------7.
// .|F----7|.
// .||OOOO||.
// .||OOOO||.
// .|L-7F-J|.
// .|II||II|.
// .L--JL--J.
// ..........`;
//     const input =`
// ...........
// .S-------7.
// .|F-----7|.
// .||.....||.
// .||.....||.
// .|L-7.F-J|.
// .|..|.|..|.
// .L--J.L--J.
// ...........`;
//     const input = `
// FF7FSF7F7F7F7F7F---7
// L|LJ||||||||||||F--J
// FL-7LJLJ||||||LJL-77
// F--JF--7||LJLJ7F7FJ-
// L---JF-JLJ.||-FJLJJ7
// |F|F-JF---7F7-L7L|7|
// |FFJF7L7F-JF7|JL---7
// 7-L-JL7||F7|L7F-7F7|
// L.L7LFJ|||||FJL7||LJ
// L7JLJL-JLJLJL--JLJ.L`;
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

function followMaze(maze, distances, x, y, points) {
    let count = 0;
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
                points.push([x, y]);
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
                points.push([x, y]);
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
                points.push([x, y]);
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
                points.push([x, y]);
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
    return count + 2;
}

function part1(data) {
    const {maze, startX, startY} = data;
    const distances = [];
    for (const row of maze) {
        distances.push(new Array(row.length).fill(-1));
    }
    distances[startY][startX] = 0;
    // in the data the two pipe connects are above and below
    const distance = followMaze(maze, distances, startX, startY + 1, []);
    console.log(`furthest is ${distance >> 1}`);
}

function part2(data) {
    const {maze, startX, startY} = data;
    const distances = [];
    const points = [[startX, startY]];
    for (const row of maze) {
        distances.push(new Array(row.length).fill(-1));
    }
    distances[startY][startX] = 0;
    // in the data the two pipe connects are above and below
    const distance = followMaze(maze, distances, startX, startY + 1, points);
    // calculate area
    let sum = 0;
    points.push(points[0]);
    for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i -1];
        const [x2, y2] = points[i];
        sum += (x1 * y2) - (y1 * x2);
    }
    const area = Math.abs(sum / 2);
    console.log(`area: ${area}`);
    console.log(`b ${distance}`);
    console.log(`points: ${JSON.stringify(points)}`);
    // A - (distance/2) + 1 = internal points
    console.log(`internal points: ${area - (distance/2) + 1}`);
}
// function part2(data) {
//     const {maze, startX, startY} = data;
//     const distances = [];
//     const tileMap = [];
//     for (const row of maze) {
//         distances.push(new Array(row.length).fill(-1));
//         tileMap.push(new Array(row.length).fill('.'));
//     }
//     distances[startY][startX] = 0;
//     followMaze(maze, distances, startX, startY + 1, 1);
//     let oddEven = 1;
//     let prev = '|';
//     for (let x = 0; x < startX; x++) {
//         if (distances[startY][x] !== -1) {
//             if (
//                 maze[startY][x] === '-' ||
//                 (['-LF'].includes(prev) && ['7J'].includes(cell))
//             ) {
//                 // nothing
//                 prev = maze[startY][x];
//             } else {
//                 oddEven = (oddEven + 1) % 2;
//                 prev = maze[startY][x];
//             }
//         }
//     }
//     for (let y = 0; y < maze.length; y++) {
//         console.log(distances[y].map(
//             (v, x) => v === -1 ? '.' : maze[y][x]
//         ).join(''))
//     }
//     // count windings in the distances map odd numbers are enclosed
//     // if a pipe is connected to the previous, it doesn't count as
//     // a crossing
//     let tiles = 0;
//     for (let y = 0; y < distances.length; y++) {
//         let crossing = 0;
//         let prev = '|';
//         let seen = false;
//         for (let x = 0; x < distances[y].length; x++) {
//             const col = distances[y][x];
//             const cell = maze[y][x];
//             if (col === -1) {
//                 if ((crossing % 2) === oddEven && seen) {
//                     tileMap[y][x] = 'I';
//                     tiles++;
//                 }
//                 prev = '|'; // to account for junk
//             } else if (
//                 cell === '-' ||
//                 (['-LF'].includes(prev) && ['7J'].includes(cell))
//             ) {
//                 // nothing
//                 prev = cell;
//                 seen = true;
//             } else {
//                 crossing++;
//                 prev = cell;
//                 seen = true;
//             }
//         }
//         for (let x = distances[y].length - 1; x >= 0; x--) {
//             if (tileMap[y][x] === 'I') {
//                 tiles--;
//                 tileMap[y][x] = '.';
//             } else {
//                 break;
//             }
//         }
//     }
//     console.log(`maybe tile count is ${tiles}`);
//     for (const row of tileMap) {
//         console.log(row.join(''));
//     }
// }

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
