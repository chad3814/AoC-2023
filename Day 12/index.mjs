import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = '?#????????????##?? 1,1,10';
    // const input = '???.### 1,1,3';
    // const input = '?###???????? 3,2,1';
    // const input = '.# 1';
    const lines = input.split('\n').filter(l => l.length > 0);
    const rows = [];
    for (const line of lines) {
        const [springs, checksum] = line.split(' ');
        rows.push({
            springs: springs.split(''),
            checksum: checksum.split(',').map(c => parseInt(c, 10)),
        });
    }
    return rows;
}

function isValid(springs, checksum) {
    const calculated = [];
    let run = 0;
    for (const spot of springs) {
        if (spot === '#') {
            run++;
        } else {
            if (run !== 0) calculated.push(run);
            run = 0;
        }
    }
    if (run !== 0) {
        calculated.push(run);
    }
    if (calculated.length !== checksum.length) return false;
    const valid = checksum.every((value, index) => calculated[index] === value);
    // if (valid) console.log(springs.join(''), checksum.join(','));
    return valid;
}

function permute(springs, checksum) {
    const index = springs.indexOf('?');
    if (index === -1) {
        // console.log(`no questions left: ${springs.join('')}; ${checksum}; isValid: ${isValid(springs, checksum)}`);
        return (isValid(springs, checksum) ? 1 : 0);
    }
    const left = springs.slice();
    const right = springs.slice();
    left[index] = '.';
    right[index] = '#';
    return permute(left, checksum) + permute(right, checksum);
}

function part1(rows) {
    const permutations = rows.map(({springs, checksum}) => permute(springs, checksum));
    const total = permutations.reduce((a, b) => a + b);
    console.log(`The sum of the different correct placements is ${total}`);
}

function unfold(rows) {
    const unfolded = [];
    for (const {springs, checksum} of rows) {
        unfolded.push({
            springs: [].concat(...springs, '?', ...springs, '?', ...springs, '?', ...springs, '?', ...springs),
            checksum: [].concat(...checksum, ...checksum, ...checksum, ...checksum, ...checksum),
        });
    }
    return unfolded;
}

function part2(rows) {
    const unfolded = unfold(rows);
    // for (const row of unfolded) {
    //     console.log(`${row.springs.join('')} ${row.checksum.join(',')}`);
    // }
    part1(unfolded);
}

async function main() {
    const rows = await parse();
    part1(rows);
    part2(rows);
}

main();
