import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = '11599\n99199\n99199\n99199\n99111'
//     const input =
// `111111111111
// 999999999991
// 999999999991
// 999999999991
// 999999999991`;
//     const input =
// `2413432311323
// 3215453535623
// 3255245654254
// 3446585845452
// 4546657867536
// 1438598798454
// 4457876987766
// 3637877979653
// 4654967986887
// 4564679986453
// 1224686865563
// 2546548887735
// 4322674655533`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const data = lines.map(l => l.split('').map(i => parseInt(i, 10)));
    return data;
}

class PQueue {
    queue = [];
    enqueue(item, value) {
        const index = this.queue.findIndex(
            (i) => i.toString() === item.toString()
        );
        if (index !== -1) {
            this.queue[index] = {item, value};
        } else {
            this.queue.push({item, value});
        }
        this.sort();
    }
    dequeue() {
        return this.queue.shift();
    }
    sort() {
        this.queue.sort((a, b) => {
            return a.value - b.value;
        });
    }
    get size() {
        return this.queue.length;
    }
}

class Cell {
    x = 0;
    y = 0;
    delta = [0, 0];
    distance = 0;
    cost = 0;
    toString() {
        return `${this.x}-${this.y}-${this.delta[0]}-${this.delta[1]}-${this.distance}`;
    }
}

const DELTAS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function part1(map) {
    const visited = new Map;
    const queue = new PQueue;
    const goalX = map[0].length - 1;
    const goalY = map.length - 1;
    const start = new Cell;
    queue.enqueue(start, 0);
    let pos;
    while (queue.size > 0) {
        const {item} = queue.dequeue();
        pos = item;
        if (pos.x === goalX && pos.y === goalY) break;
        for (const delta of DELTAS) {
            const newPos = new Cell;
            newPos.x = pos.x + delta[0];
            newPos.y = pos.y + delta[1];
            newPos.delta[0] = delta[0];
            newPos.delta[1] = delta[1];

            if (newPos.x < 0 || newPos.x > goalX) continue;
            if (newPos.y < 0 || newPos.y > goalY) continue;
            const sameDirection = (pos.delta[0] === delta[0] && pos.delta[1] === delta[1]);
            if (sameDirection && pos.distance >= 3) continue;
            if (pos.delta[0] === -delta[0] && pos.delta[1] === -delta[1]) continue;
            if (sameDirection) newPos.distance = pos.distance + 1; else newPos.distance = 1;

            newPos.cost = pos.cost + map[newPos.y][newPos.x];
            const visitedCost = visited.get(newPos.toString());
            if (visitedCost && visitedCost <= newPos.cost) continue;

            visited.set(newPos.toString(), newPos.cost);
            queue.enqueue(newPos, newPos.cost);
        }
    }
    console.log(`cost is ${pos.cost}`);
}

function part2(map) {
    const visited = new Map;
    const queue = new PQueue;
    const goalX = map[0].length - 1;
    const goalY = map.length - 1;
    const start = new Cell;
    queue.enqueue(start, 0);
    let pos;
    while (queue.size > 0) {
        const {item} = queue.dequeue();
        pos = item;
        if (pos.x === goalX && pos.y === goalY) break;
        for (const delta of DELTAS) {
            let deltaCost = 0;
            const sameDirection = (pos.delta[0] === delta[0] && pos.delta[1] === delta[1]);
            if (pos.delta[0] === -delta[0] && pos.delta[1] === -delta[1]) continue;
            if (sameDirection) continue;

            // go 3 steps in this direction
            for (let step = 1; step < 4; step++) {
                const x = pos.x + step * delta[0];
                const y = pos.y + step * delta[1];
                if (x < 0 || x > goalX) continue;
                if (y < 0 || y > goalY) continue;
                deltaCost += map[y][x];
            }

            // now check and add steps 4-10
            for (let step = 4; step <= 10; step++) {
                const newPos = new Cell;
                newPos.x = pos.x + step * delta[0];
                newPos.y = pos.y + step * delta[1];
                newPos.delta[0] = delta[0];
                newPos.delta[1] = delta[1];

                if (newPos.x < 0 || newPos.x > goalX) continue;
                if (newPos.y < 0 || newPos.y > goalY) continue;
                newPos.distance = step + 1;

                deltaCost += map[newPos.y][newPos.x];
                newPos.cost = pos.cost + deltaCost;
                // console.log(`from [${pos.x}, ${pos.y}] to [${newPos.x}, ${newPos.y}] costs ${newPos.cost}`);

                const visitedCost = visited.get(newPos.toString());
                if (visitedCost && visitedCost <= newPos.cost) continue;

                visited.set(newPos.toString(), newPos.cost);
                queue.enqueue(newPos, newPos.cost);
            }
        }
    }
    console.log(`cost is ${pos.cost}`);
}

async function main() {
    const map = await parse();
    part1(map);
    part2(map);
}

main();
