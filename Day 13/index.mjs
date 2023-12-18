import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = `#.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.
//
// #...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#`;
//     const input =
// `#.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.

// #...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#`;
    const lines = input.split('\n');

    const sections = [];
    let last = [];
    for (const line of lines) {
        if (line.length === 0) {
            sections.push(last);
            last = [];
            continue;
        }
        last.push(line.split(''));
    }
    if (last.length > 0) sections.push(last);
    return sections;
}

function isSame (a, b) {
    const same = a.join('') === b.join('');
    // if (same) {
    //     console.log(a.join(''));
    //     console.log(b.join(''));
    // }
    return same;
}

function isSameOffOne (a, b) {
    let differences = 0;
    for (let i = 0; i < a.length; i++) {
        differences += (a[i] === b[i]) ? 0 : 1;
    }
    return differences === 1;
}

function getColum(section, column) {
    return section.map(row => row[column]);
}

function dumpSection(section) {
    for (const row of section) {
        console.log(row.join(''));
    }
}

function part1(sections) {
    let total = 0;
    for (const section of sections) {
        // check for vertical
        let hasVertical = false;
        for (let col = 1; col < section[0].length; col++) {
            const colA = getColum(section, col - 1);
            const colB = getColum(section, col);
            if (isSame(colA, colB)) {
                const left = col - 1;
                const right = section[0].length - col - 1;
                const dist = Math.min(left, right);
                let reflected = true;
                for (let i = 1; i <= dist; i++) {
                    reflected = reflected && isSame(getColum(section, col - i - 1), getColum(section, col + i));
                }
                if (reflected) {
                    // dumpSection(section);
                    total += left + 1;
                    hasVertical = true;
                    break;
                }
            }
        }
        if (hasVertical) continue;

        // check for horizontal
        let hasHorizontal = false;
        for (let row = 1; row < section.length; row++) {
            if (isSame(section[row - 1], section[row])) {
                const above = row - 1;
                const below = section.length - row - 1;
                const dist = Math.min(above, below);
                let reflected = true;
                for (let i = 1; i <= dist; i++) {
                    reflected = reflected && isSame(section[row - i - 1], section[row + i]);
                }
                if (reflected) {
                    total += 100 * (above + 1);
                    hasHorizontal = true;
                    break;
                }
            }
        }
        if (!hasHorizontal) {
            dumpSection(section);
            throw new Error('no reflection');
        }
    }
    console.log(`total is ${total}`);
}

function part2(sections) {
    let total = 0;
    for (const section of sections) {
        // check for vertical
        let hasVertical = false;
        let errored = false;
        for (let col = 1; col < section[0].length; col++) {
            errored = false;
            const left = col - 1;
            const right = section[0].length - col - 1;
            const dist = Math.min(left, right);
            let reflected = true;
            for (let i = 0; i <= dist; i++) {
                let same = isSame(getColum(section, col - i - 1), getColum(section, col + i));
                if (!same && !errored) {
                    same = isSameOffOne(getColum(section, col - i - 1), getColum(section, col + i));
                    errored = same;
                }
                reflected = reflected && same;
            }
            if (reflected && errored) {
                // dumpSection(section);
                total += left + 1;
                hasVertical = true;
                console.log(`have a vertical reflection at ${left}`);
                dumpSection(section);
                break;
            }
        }
        if (hasVertical) continue;

        // check for horizontal
        let hasHorizontal = false;
        errored = false;
        for (let row = 1; row < section.length; row++) {
            errored = false;
            const above = row - 1;
            const below = section.length - row - 1;
            const dist = Math.min(above, below);
            let reflected = true;
            for (let i = 0; i <= dist; i++) {
                let same = isSame(section[row - i - 1], section[row + i]);
                if (!same && !errored) {
                    same = isSameOffOne(section[row - i - 1], section[row + i]);
                    errored = same;
                }
                reflected = reflected && same;
            }
            if (reflected && errored) {
                total += 100 * (above + 1);
                hasHorizontal = true;
                console.log(`have a horizontal reflect at ${above}`);
                dumpSection(section);
                break;
            }
        }
        if (!hasHorizontal || !errored) {
            dumpSection(section);
            throw new Error('no reflection');
        }
    }
    console.log(`total is ${total}`);
}

async function main() {
    const sections = await parse();
    part1(sections);
    part2(sections);
}

main();
