import fs from 'fs/promises';

const RE = /^Game (?<id>\d+): (?<pulls>((; )?(, )?(?<count>\d+) (?<color>red|blue|green))+)$/;
const PULL = /^(?<count>\d+) (?<color>red|blue|green)$/;
async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n');
    const games = {};
    for (const line of lines) {
        if (line.length === 0) continue;
        const matches = line.match(RE);
        const pulls = matches.groups.pulls.split('; ');
        const draws = [];
        for (const pull of pulls) {
            const colors = pull.split(', ');
            const draw = {};
            for (const color of colors) {
                const match = color.match(PULL);
                const count = parseInt(match.groups.count, 10);
                draw[match.groups.color] = count;
            }
            draws.push(draw);
        }
        games[matches.groups.id] = draws;
    }
    return games;
}

function gamePasses(draws) {
    for (const draw of draws) {
        if (draw.red && draw.red > 12) return false;
        if (draw.green && draw.green > 13) return false;
        if (draw.blue && draw.blue > 14) return false;
    }
    return true;
}

function part1(games) {
    let total = 0;
    for (const gameId of Object.keys(games)) {
        const game = games[gameId];
        if (gamePasses(game)) total += parseInt(gameId, 10);
    }
    console.log(`sum of the ids of passing games: ${total}`);
}

function maxColors(draws) {
    const max = {
        red: 0,
        green: 0,
        blue: 0,
    };
    for (const draw of draws) {
        if (draw.red) max.red = Math.max(max.red, draw.red);
        if (draw.green) max.green = Math.max(max.green, draw.green);
        if (draw.blue) max.blue = Math.max(max.blue, draw.blue);
    }
    return max;
}
function part2(games) {
    let total = 0;
    for (const game of Object.values(games)) {
        const max = maxColors(game);
        total += (max.red * max.green * max.blue);
    }
    console.log(`the sum of the power of the min set of cubes is ${total}`);
}

async function main() {
    const games = await parse();
    part1(games);
    part2(games);
}

main();