import fs from 'fs/promises';

const RE = /^(?<location>...) = \((?<left>...), (?<right>...)\)$/;
async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split(/[\n\r]/).filter(l => l.length !== 0);
    const instructions = lines.shift().split('');

    const locations = {};
    for (const line of lines) {
        const match = line.match(RE);
        if (!match) throw new Error('mismatch');
        locations[match.groups.location] = {
            left: match.groups.left,
            right: match.groups.right,
        }
    }
    return {instructions, locations};
}

function part1(data) {
    const {instructions, locations} = data;
    let steps = 0;
    let location = 'AAA';
    let direction;
    while (location !== 'ZZZ') {
        direction = instructions[steps % instructions.length];
        location = direction === 'L' ? locations[location].left : locations[location].right;
        steps++;
    }
    console.log(`it took ${steps} steps`);
}

let c = 0;
function allAtZ(locations) {
    // if (c % 100 === 0) console.log(locations.map(l => l.charAt(2)).join(' '));
    // c++;
    for (const location of locations) {
        if (location.charAt(2) !== 'Z') return false;
    }
    return true;
}

function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function part2(data) {
    const {instructions, locations} = data;
    // const instructions = ['L', 'R'];
    // const locations = {
    //     '11A': {left: '11B', right: 'XXX'},
    //     '11B': {left: 'XXX', right: '11Z'},
    //     '11Z': {left: '11B', right: 'XXX'},
    //     '22A': {left: '22B', right: 'XXX'},
    //     '22B': {left: '22C', right: '22C'},
    //     '22C': {left: '22Z', right: '22Z'},
    //     '22Z': {left: '22B', right: '22B'},
    //     'XXX': {left: 'XXX', right: 'XXX'}
    // };
    let steps = 0;
    const currentLocations = Object.keys(locations).filter(location => location.charAt(2) === 'A');
    console.log(`thread starts: ${currentLocations.join(', ')}`);
    console.log(`instruction length: ${instructions.length}`);
    const counts = [];
    for (const currentLocation of currentLocations) {
        steps = 0;
        let location = currentLocation;
        console.log(`start at ${location}`);
        while(!location.endsWith('Z')) {
            console.log(location);
            location = instructions[steps % instructions.length] === 'L' ?
                locations[location].left :
                locations[location].right;
            steps++;
        }
        counts.push(steps);
    }
    console.log(counts.join(', '));
    const multi = counts.reduce(lcm);
    console.log(`naive lcm is ${multi}`)
}

async function main() {
    const data =await parse();
    part1(data);
    part2(data);
}

main();
