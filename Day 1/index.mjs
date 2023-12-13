import fs from 'fs/promises';

const ONE_DIGIT = /(\d|zero|one|two|three|four|five|six|seven|eight|nine)/g;
const VALUE_MAP = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
};

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n');
    return lines.filter(l => l.length > 0);
}

function part1(lines) {
    let total = 0;
    for (const line of lines) {
        const matches = line.match(/\d/g);
        const first = parseInt(matches[0]);
        const last = parseInt(matches[matches.length - 1]);
        total += (10 * first) + last;
    }
    console.log(`sum of calibration values: ${total}`);
}

function part2(lines) {
    let total = 0;
    for (const line of lines) {
        const matches = line.match(ONE_DIGIT);
        const first = VALUE_MAP[matches[0]];
        const last = VALUE_MAP[matches[matches.length - 1]];
        total += (10 * first) + last;
    }
    console.log(`sum of calibration values: ${total}`);
}

async function main() {
    const lines = await parse();
    part1(lines);
    part2(lines);
}

main();
