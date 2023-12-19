import { dir } from 'console';
import { NODATA } from 'dns';
import { Dir } from 'fs';
import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = '11599\n99199\n99199\n99199\n99111'
    const lines = input.split('\n').filter(l => l.length > 0);
    const data = lines.map(l => l.split('').map(i => parseInt(i, 10)));
    return data;
}

class PQueue {
    queue = [];
    sort() {
        this.queue.sort((a, b) => a.value - b.value);
    }
    next() {
        const node = this.queue.shift();
        return [node.item, node.value];
    }
    update(item, value) {
        const s = JSON.stringify(item);
        let set = false;
        for (let i = 0; i < this.queue.length; i++) {
            if (JSON.stringify(this.queue[i].item) === s) {
                this.queue[i].value = value;
                set = true;
                break;
            }
        }
        if (!set) {
            this.queue.push({item, value});
        }
        this.sort();
    }
    get size() {
        return this.queue.length;
    }
}

const Directions = {
    NORTH: [0, -1],
    EAST: [1, 0],
    SOUTH: [0, 1],
    WEST: [-1, 0],
};
const Opposite = {
    NORTH: 'SOUTH',
    EAST: 'WEST',
    SOUTH: 'NORTH',
    WEST: 'EAST',
};
function part1(map) {
    const pq = new PQueue;
    const start = {x: 0, y: 0, direction: null, run: 0};
    const end = {x: map[0].length - 1, y: map.length - 1, direction: null, run: 0};
    pq.update(start, 0);
    const visited = new Set;

    while (pq.size > 0) {
        const [node, value] = pq.next();
        console.log(`node: ${JSON.stringify(node)} value: ${value} visited: ${visited.size}`);
        //console.log('queue:', JSON.stringify(pq.queue));
        if (node.x === end.x && node.y === end.y) {
            console.log(`value: ${value}`);
            break;
        }
        if (visited.has(JSON.stringify(node))) {
            continue;
        }
        visited.add(JSON.stringify(node));
        for(const [direction, delta] of Object.entries(Directions)) {
            const [dx, dy] = delta;
            let newNode = {x: node.x + dx, y: node.y + dy, direction, run: 0};
            if (
                direction === node.direction ||
                Opposite[direction] === node.direction ||
                (newNode.x === node.x && newNode.y === node.y)
            ) {
                continue;
            }

            let valueDelta = 0;
            for (let i = 1; i <= 3; i++) {
                newNode = {x: node.x + dx * i, y: node.y + dy * i, direction, run: i};
                if (
                    newNode.x >= 0 && newNode.x <= end.x &&
                    newNode.y >= 0 && newNode.y <= end.y
                ) {
                    valueDelta += map[newNode.y][newNode.x];
                    if (Number.isNaN(valueDelta)) {
                        throw new Error(`valueDelta is NaN map[${newNode.y}][${newNode.x}]=${map[newNode.y][newNode.x]}`);
                    }
                    pq.update(newNode, value + valueDelta);
                }
            }
        }
    }
}

function part2(map) {

}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
