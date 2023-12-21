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
    // console.log(`spots: ${JSON.stringify(spots)}`);
    console.log(`total gardens after ${steps} is ${spots.length}`);
}

function part2(map) {
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
    const steps = 26501365;
    let spots = new Set;
    spots.add(`${x}#${y}`);
    let nextSpots = new Set;
    for (let step = 0; step < steps; step++) {
        for (const s of spots.values()) {
            const spot = s.split('#').map(i => parseInt(i, 10));
            for (const delta of DELTAS) {
                x = ((spot[0] + delta[0] + steps * map[0].length) % map[0].length);
                y = ((spot[1] + delta[1] + steps * map.length) % map.length);
                // console.log(x, y);
                if (map[y][x] === '#') continue;
                const newSpot = [spot[0] + delta[0], spot[1] + delta[1]];
                nextSpots.add(`${newSpot[0]}#${newSpot[1]}`);
            }
        }
        spots = nextSpots;
        nextSpots = new Set
    }
    // console.log(`spots: ${JSON.stringify([...spots.values])}`);
    console.log(`total gardens after ${steps} is ${spots.size}`);
}

async function main() {
    const map = await parse();
    part1(map);
    part2(map);
}

main();
