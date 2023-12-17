import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = '123\n456\n789';
    const lines = input.split('\n');
    const data = lines.map(l => l.split('').map(i => parseInt(i, 10)));
    return data;
}

let X;
let Y;
function route(map, been, pos) {
    const x = pos.x;
    const y = pos.y;
    const last1 = pos.last1;
    const last2 = pos.last2;
    const last3 = pos.last3;
    const cost = pos.cost;

    const isStraight = (last1 === last2 && last2 === last3)
    const options = [];
    if (
        x > 0 &&
        been[y * Y + x - 1] > cost &&
        (last1 !== 'W' || !isStraight)
    ) options.push([x - 1, y, 'W']);
    if (
        x < X &&
        been[y * Y + x + 1] > cost &&
        (last1 !== 'E' || !isStraight)
    ) options.push([x + 1, y, 'E']);
    if (
        y > 0 &&
        been[(y - 1) * Y + x] > cost &&
        (last1 !== 'N' || !isStraight)
    ) options.push([x, y - 1, 'N']);
    if (
        x < Y &&
        been[(y + 1) * Y + x] > cost &&
        (last1 !== 'S' || !isStraight)
    ) options.push([x, y + 1, 'S']);

    return options.map(p => {
        been[p[1] * Y + p[0]] = map[p[1]][p[0]] + cost;
        return {
            x: p[0],
            y: p[1],
            last1: p[2],
            last2: last1,
            last3: last2,
            cost: map[p[1]][p[0]] + cost,
        };
    });
}
function part1(map) {
    X = map[0].length;
    Y = map.length;
    const been = new Array(X * Y).fill(Number.MAX_SAFE_INTEGER);
    been[0] = 0;
    let min = Number.MAX_SAFE_INTEGER;
    const paths = route(map, been, {x: 0, y: 0, cost: 0});
    while (paths.length > 0) {
        const pos = paths.pop();
        console.log(JSON.stringify(pos));
        if (pos.x === (X - 1) && pos.y === (Y - 1)) {
            if (pos.cost < min) {
                min = pos.cost;
                console.log('new min', min);
            }
            continue;
        }
        const newPaths = route(map, been, pos);
        for (const np of newPaths) {
            if (np.cost < min) paths.push(np);
        }
    }
    console.log(`the minimum is ${min}`);
}

function part2(map) {

}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
