import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = '?#????????????##?? 1,1,10';
    // const input = '???.### 1,1,3';
    // const input = '?###???????? 3,2,1';
    // const input = '.# 1';
    // const input = '.?????.??#? 1,2';
//     const input =
// `???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1`;
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
    // console.log(`The sum of the different correct placements is ${total}`);
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

function tokenize(springs) {
    const tokens = [];
    let token = '';
    for (let i = 0; i < springs.length; i++) {
        const c = springs[i];
        if (c !== '.') {
            token += c;
            continue;
        }
        if (c !== '') {
            tokens.push(token);
            token = '';
        }
    }
    if (token !== '') {
        tokens.push(token);
    }
    return tokens;
}

function fits(map, start, size) {
    const end = start + size - 1;
    if (end >= map.length) return false; // can't be off the end
    if (map[start -1] == '#') return false; // can't connect with previous
    if (map[end + 1] == '#') return false; // can't connect with next
    for (let i = start; i <= end; i++) {
        if (map[i] == '.') return false; // has to be a string of springs
    }
    return true;
}

function findFirst(map, start, check) {
    for (let i = start; i < map.length; i++) {
        if (fits(map, i, check.size)) {
            check.positions.push(i);
            return i + check.size + 1;
        }
    }
}
function findLowest(map, checksum) {
    let start = 0;
    for (const check of checksum) {
        start = findFirst(map, start, check);
    }
}
function findLast(map, start, check) {
    for (let i = start; i >= 0; i--) {
        if (fits(map, i, check.size)) {
            check.positions.push(i);
            return i - 2;
        }
    }
}
function findHighest(map, checksum) {
    let start = map.length - checksum[checksum.length - 1].size;
    for (let i = checksum.length - 1; i >= 0; i--) {
        start = findLast(map, start, checksum[i]);
    }
}
function findMiddle(map, check) {
    const start = check.positions[0] + 1;
    const end = check.positions.pop();
    // console.log(`start: ${start}; end: ${end}`);
    if (start === end + 1) {
        // console.log('returned without push');
        return;
    }
    for (let i = start; i < end; i++) {
        if (fits(map, i, check.size)) {
            check.positions.push(i);
        }
    }
    check.positions.push(end);
}
function findAllMiddles(map, checksum) {
    for (const check of checksum) {
        findMiddle(map, check);
    }
}
function count(map, checksum) {
    for (let i = 0; i < checksum.length - 1; i++) {
        const check = checksum[i];
        const next = checksum[i + 1];
        for (let p = 0; p < check.positions.length; p++) {
            const position = check.positions[p];
            const min = position + check.size + 1;
            // first # possible in next check
            const index = map.indexOf('#', min);
            let max = index;
            if (index === -1) max = map.length - 1;
            for (let np = 0; np < next.positions.length; np++) {
                const nextPos = next.positions[np];
                if (nextPos >= min && nextPos <= max)
                    next.counts[nextPos] += check.counts[position];
            }
        }
        // console.log(`checksum ${i} counts: ${JSON.stringify(check.counts)}`);
    }
    const last = checksum.pop();
    // console.log(JSON.stringify(last, null, 4));
    let sum = 0;
    for (const key of Object.keys(last.counts)) {
        console.log(`${key}: ${last.counts[key]}; sum: ${sum}`);
        sum += last.counts[key];
    }
    return sum;
}
function part2(rows) {
    rows = unfold(rows);
    let sum = 0;
    for (const row of rows) {
        const map = tokenize(row.springs).join('.');
        const checksum = [];
        for (const size of row.checksum) {
            checksum.push({size, positions:[]});
        }
        findLowest(map, checksum);
        findHighest(map, checksum);
        findAllMiddles(map, checksum);
        // console.log(`map: ${map}; checksum: ${JSON.stringify(checksum)}`);
        const first = map.indexOf('#');
        if (first !== -1) {
            const check = checksum[0];
            for (let i = check.positions.length - 1; i >= 0; i--) {
                // can't have the first check start after the first #
                if (check.positions[i] > first) check.positions.pop();
            }
        }
        const last = map.lastIndexOf('#');
        if (last !== -1) {
            const check = checksum.pop();
            // console.log(`last checksum ${JSON.stringify(check)}`);
            for (const position of check.positions) {
                if ((position + check.size) < last) {
                    // can't have the last check end before the last #
                    check.positions.shift();
                }
            }
            checksum.push(check);
        }
        for (const check of checksum) {
            check.counts = {};
            for (const position of check.positions) {
                check.counts[position] = (check === checksum[0] ? 1 : 0);
            }
        }
        sum += count(map, checksum);
    }
    console.log(`sum is ${sum}`);
}

async function main() {
    const rows = await parse();
    //part1(rows);
    part2(rows);
}

main();
