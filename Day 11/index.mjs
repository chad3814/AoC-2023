import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n').filter(l => l.length > 0);
    const map = [];
    const rows = [];
    for (let y = 0; y < lines.length; y++) {
        const row = lines[y].split('');
        if (row.every(c => c === '.')) {
            rows.push(y);
        }
        map.push(row);
    }
    const cols = [];
    for(let col = 0; col < map[0].length; col++) {
        if (map.every(row => row[col] === '.')) {
            cols.push(col);
        }
    }
    return {map, cols, rows};
}

function expand(map, cols, rows) {
    const expanded = [];
    for (let y = 0; y < map.length; y++) {
        if (rows.includes(y)) {
            expanded.push(map[y].slice());
        }
        expanded.push(map[y].slice());
    }
    for (let x = 0; x < cols.length; x++) {
        const col = cols[x] + x;
        for (const row of expanded) {
            row.splice(col, 0, '.');
        }
    }
    return expanded;
}

function part1(map) {
    const galaxies = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
            if (map[row][col] === '#') {
                galaxies.push([col, row]);
            }
        }
    }
    let total = 0;
    while (galaxies.length > 0) {
        const galaxyA = galaxies.shift();
        for (const galaxyB of galaxies) {
            const dist = Math.abs(galaxyA[0] - galaxyB[0]) + Math.abs(galaxyA[1] - galaxyB[1]);
            total += dist;
        }
    }
    console.log(`the sum of the shortest distances is ${total}`);
}

function part2(map, cols, rows) {
    const galaxies = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
            if (map[row][col] === '#') {
                galaxies.push([col, row]);
            }
        }
    }
    let total = 0;
    while (galaxies.length > 0) {
        const galaxyA = galaxies.shift();
        for (const galaxyB of galaxies) {
            const dist = Math.abs(galaxyA[0] - galaxyB[0]) + Math.abs(galaxyA[1] - galaxyB[1]);
            const minCol = Math.min(galaxyA[0], galaxyB[0]);
            const maxCol = Math.max(galaxyA[0], galaxyB[0]);
            const minRow = Math.min(galaxyA[1], galaxyB[1]);
            const maxRow = Math.max(galaxyA[1], galaxyB[1]);
            let gaps = 0;
            for (const gap of cols) {
                if (minCol < gap && gap < maxCol) gaps++;
            }
            for (const gap of rows) {
                if (minRow < gap && gap < maxRow) gaps++;
            }
            total += dist + (gaps * 999999);
        }
    }
    console.log(`the sum of the shortest distances is ${total}`);
}

async function main() {
    const {map, cols, rows} = await parse();
    part1(expand(map, cols, rows));
    part2(map, cols, rows);
}

main();
