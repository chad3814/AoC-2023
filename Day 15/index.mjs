import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    // const input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7';
    const lines = input.split('\n').filter(l => l.length > 0);
    return lines[0].split(',');
}

function hash(str) {
    let value = 0;
    for (const c of str.split('')) {
        value += c.charCodeAt(0);
        value *= 17;
        value %= 256;
    }
    return value;
}

function part1(steps) {
    let total = 0;
    for (const step of steps) total += hash(step);
    console.log(`total is ${total}`);
}

const RE = /^(?<label>[^=\-]+)(?<op>[=\-])(?<focal>\d)?$/;
function part2(steps) {
    const boxes = new Array(256);
    for (const step of steps) {
        const match = step.match(RE);
        if (!match) throw new Error(`mismatch ${step}`);
        const label = match.groups.label;
        const op = match.groups.op;
        const focal = match.groups.focal;
        const h = hash(label);
        if (op === '=') {
            if (boxes[h] === undefined) {
                boxes[h] = [];
            }
            const index = boxes[h].findIndex(box => box[0] === label);
            if (index === -1) {
                boxes[h].push([label, parseInt(focal, 10)]);
            } else {
                boxes[h][index][1] = focal;
            }
        } else {
            if (boxes[h] !== undefined) {
                const index = boxes[h].findIndex(([lab]) => {
                    return lab === label
                });
                if (index !== -1) {
                    boxes[h].splice(index, 1);
                }
            }
        }
    }
    let total = 0;
    for (let i = 0; i < 256; i++) {
        const box = boxes[i];
        if (box === undefined || box.length === 0) continue;
        let slot = 1;
        for (const [_, focal] of boxes[i]) {
            total += (i + 1) * slot * focal;
            slot++;
        }
        console.log(`Box ${i}: ${box.map(([label, focal]) => `[${label} ${focal}]`).join(' ')}`);
    }
    console.log(`total focal power ${total}`);
}

async function main() {
    const steps = await parse();
    part1(steps);
    part2(steps);
}

main();
