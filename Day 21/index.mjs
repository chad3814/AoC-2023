import exp from 'constants';
import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
//     const input =
// `...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#.#....
// .##..S####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const map = [];
    for (const line of lines) {
        map.push(line.split(''));
    }
    return map;
}
const DELTAS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function findSpots(map, x, y, steps) {
    let spots = [[x, y]];
    let nextSpots = [];
    for (let step = 0; step < steps; step++) {
        for (const spot of spots) {
            for (const delta of DELTAS) {
                const newSpot = [spot[0] + delta[0], spot[1] + delta[1]];
                if (newSpot[0] < 0 || newSpot[0] >= map[0].length) continue;
                if (newSpot[1] < 0 || newSpot[1] >= map.length) continue;
                if (map[newSpot[1]][newSpot[0]] === '#') continue;
                if (!nextSpots.some(p => p[0] === newSpot[0] && p[1] === newSpot[1])) {
                    nextSpots.push(newSpot);
                }
            }
        }
        spots = nextSpots;
        nextSpots = [];
    }
    return spots;
}

function part1(map) {
    let x;
    let y;
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (map[j][i] === 'S') {
                x = i;
                y = j;
            }
        }
    }
    const steps = 64;
    const spots = findSpots(map, x, y, steps);
    // console.log(`spots: ${JSON.stringify(spots)}`);
    console.log(`total gardens after ${steps} is ${spots.length}`);
}

function merge(a, b) {
    const set = new Set;
    for (const spot of a) {
        set.add(`${spot[0]}#${spot[1]}`);
    }
    for (const spot of b) {
        set.add(`${spot[0]}#${spot[1]}`);
    }
    return set.size;
}
function part2(map) {
    const expandedMap = [];
    for (let k = 0; k < 7; k++) {
        for (let j = 0; j < map.length; j++) {
            const row = map[j];
            expandedMap.push([...row, ...row, ...row, ...row, ...row, ...row, ...row]);
        }
    }
    const spots = findSpots(expandedMap, 131*2+65, 131*2+65, 131*2+65);
    const counts = [];
    for (let j = 0; j < 5; j++) {
        const row = [];
        for (let i = 0; i < 5; i++) {
            row.push(spots.filter(
                s =>
                    s[0] >= i*131 && s[0] < (i+1)*131 &&
                    s[1] >= j*131 && s[1] < (j+1)*131
            ).length);
        }
        counts.push(row);
    }

    const max = Math.max(...counts.flat());
    const width = max.toString().length;
    const log = [];
    for (let j = 0; j < 5; j++) {
        let s = [];
        for (let i = 0; i < 5; i++) {
            s.push(counts[j][i].toString().padStart(width));
        }
        log.push(s.join(' | '));
    }
    console.log(log.join(`\n${'-'.repeat(log[0].length)}\n`));
    // const topSpots = spots.filter(s => s[1] < 131 && s[0] > 262 && s[0] < 393).length;
    // const bottomSpots = spots.filter(s => s[1] >= 131*4 && s[0] > 262 && s[0] < 393).length;
    // const leftSpots = spots.filter(s => s[0] < 131 && s[1] >= 131*2 && s[1] < 131*3).length;
    // const rightSpots = spots.filter(s => s[0] > 131*4 && s[1] >= 131*2 && s[1] < 131*3).length;
    // const upperLeftSpots = spots.filter(s => s[0] < 262 && s[0] >= 131 && s[1] >= 131 && s[1] < 262).length;
    // const upperRightSpots = spots.filter(s => s[0] < 131*4 && s[0] >= 131*3 && s[1] >= 131 && s[1] < 262).length;
    // const lowerLeftSpots = spots.filter(s => s[0] < 262 && s[0] >= 131 && s[1] >= 131*3 && s[1] < 131*4).length;
    // const lowerRightSpots = spots.filter(s => s[0] < 131*4 && s[0] >= 131*3 && s[1] >= 131*3 && s[1] < 131*4).length;
    // const jSpots1 = spots.filter(s => s[0] < 131*2 && s[0] >= 131 && s[1] < 131).length;
    // const jSpots2 = spots.filter(s => s[0] < 131 && s[0] >= 0 && s[1] < 131*2 && s[1] >= 131).length;
    // const lSpots1 = spots.filter(s => s[0] < 131*4 && s[0] >= 131*3 && s[1] < 131).length;
    // const lSpots2 = spots.filter(s => s[0] < 131*5 && s[0] >= 131*4 && s[1] < 131*2 && s[1] >= 131).length;
    // const sSpots1 = spots.filter(s => s[0] < 131 && s[0] >= 0 && s[1] < 131*4 && s[1] >= 131*3).length;
    // const sSpots2 = spots.filter(s => s[0] < 131*2 && s[0] >= 131 && s[1] < 131*5 && s[1] >= 131*4).length;
    // const fSpots1 = spots.filter(s => s[0] < 131*5 && s[0] >= 131*4 && s[1] < 131*4 && s[1] >= 131*3).length;
    // const fSpots2 = spots.filter(s => s[0] < 131*4 && s[0] >= 131*3 && s[1] < 131*5 && s[1] >= 131*4).length;

    // console.log(`j1: ${jSpots1}`);
    // console.log(`j2: ${jSpots2}`);
    // console.log(`l1: ${lSpots1}`);
    // console.log(`l2: ${lSpots2}`);
    // console.log(`71: ${sSpots1}`);
    // console.log(`72: ${sSpots2}`);
    // console.log(`f1: ${fSpots1}`);
    // console.log(`f2: ${fSpots2}`);
    return;
    const interiorSpots = 7404;
    const steps = 26501365;
    // this will only work because the row the S is one is clear of rocks
    // and the column S is on is also clear of rocks, and the fact that
    // it is in the center and 65 away from each edge
    const n = ((steps - 65) / 131) + 1;
    const nSub1 = n - 1;
    const totalSquares = nSub1**2 + n**2;
    const pointSquares = 4; // top, right, bottom, left most
    const angleSquares = n - 2;
    const interiorSquares = totalSquares - pointSquares - 4*angleSquares;
    /*
    After 327
   0 |  957 | 5579 |  956 |    0
--------------------------------
 957 | 6496 | 7481 | 6490 |  956
--------------------------------
5575 | 7481 | 7407 | 7481 | 5584
--------------------------------
 940 | 6486 | 7481 | 6501 |  962
--------------------------------
   0 |  940 | 5580 |  962 |    0
    */
    /*
            after 65
    1           []

            after 65+131
                []
    5-0       [][][]
                []

            after 65+131+131
               J[]L
             J[][][]L
    13-1    [][][][][]
             7[][][]F
               7[]F

        after 65+131+131+131
              []
            [][][]
          [][][][][]
    25-2[][][][][][][]
          [][][][][]
            [][][]
              []
    */
   const total = 
        interiorSquares * interiorSpots
        topSpots + 
        rightSpots +
        bottomSpots +
        leftSpots +
        angleSquares * upperLeftSpots +
        angleSquares * upperRightSpots +
        angleSquares * lowerLeftSpots +
        angleSquares * lowerRightSpots;
   console.log(`total is ${total}`);
}

async function main() {
    const map = await parse();
    part1(map);
    part2(map);
}

main();
