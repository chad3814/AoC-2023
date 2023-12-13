import fs from 'fs/promises';

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

const ZERO_CODE = '0'.charCodeAt(0);
const NINE_CODE = '9'.charCodeAt(0);
const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
function getValue(str) {
    if (str.charCodeAt(0) >= ZERO_CODE && str.charCodeAt(0) <= NINE_CODE) {
        return str.charCodeAt(0) - ZERO_CODE;
    }
    for (let i = 0; i < 10; i++) {
        const word = DIGITS[i];
        if (str.substr(0, word.length) === word) return i;
    }
    return null;
}

function getFirst(line) {
    for (let i = 0; i < line.length; i++) {
        const value = getValue(line.substr(i));
        if (value !== null) return value;
    }
    throw new Error('no digits on ' + line);
}

function getLast(line) {
    for (let i = line.length - 1; i >= 0; i--) {
        const value = getValue(line.substr(i));
        if (value !== null) return value;
    }
    throw new Error('no digits on ' + line);
}

function part2(lines) {
    let total = 0;
    for (const line of lines) {
        const first = getFirst(line);
        const last = getLast(line);
        total += first * 10 + last;
    }
    console.log(`sum of calibration values: ${total}`);
}

async function main() {
    const lines = await parse();
    part1(lines);
    part2(lines);
}

main();
