import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n').filter(l => l.length > 0);
    // const lines = ['0 3 6 9 12 15', '1 3 6 10 15 21', '10 13 16 21 30 45'];
    const sequences = [];
    for (const line of lines) {
        sequences.push(line.split(/\s/).map(i => parseInt(i, 10)));
    }
    return sequences;
}

function getDifferences(sequence) {
    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
        differences.push(sequence[i] - sequence[i - 1]);
    }
    // console.log(`S - ${sequence.join(' ')}`);
    // console.log(`D -   ${differences.join(' ')}`);
    return differences;
}

function allSame(sequence) {
    const check = sequence[0];
    for (const i of sequence) {
        if (check !== i) return false;
    }
    return true;
}

function part1(sequences) {
    let total = 0;
    for (const sequence of sequences) {
        const differences = [sequence.slice()];
        while (!allSame(differences[0])) {
            differences.unshift(getDifferences(differences[0]));
        }
        let diff = differences[0][0];
        let last, next;
        while (differences.length > 1) {
            differences.shift();
            last = differences[0];
            next = diff + last[last.length - 1];
            last.push(next);
            // console.log(`L${diff} - ${last.join(' ')}`);
            diff = next;
        }
        total += diff;
        // console.log(total);
    }
    console.log(`the total of the new entries is ${total}`);
}

function part2(sequences) {
    let total = 0;
    for (const sequence of sequences) {
        const differences = [sequence.slice()];
        while (!allSame(differences[0])) {
            differences.unshift(getDifferences(differences[0]));
        }
        let diff = differences[0][0];
        let last, next;
        while (differences.length > 1) {
            differences.shift();
            last = differences[0];
            next = last[0] - diff;
            last.unshift(next);
            // console.log(`L${diff} - ${last.join(' ')}`);
            diff = next;
        }
        total += diff;
        // console.log(total);
    }
    console.log(`the total of the new entries is ${total}`);
}

async function main() {
    const sequences = await parse();
    part1(sequences);
    part2(sequences);
}

main();
