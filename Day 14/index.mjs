import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n').filter(l => l.length > 0);
}

function part1(data) {

}

function part2(data) {

}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
