import fs from 'fs/promises';

const RE = /^Card\s+(?<card>\d+):\s+(?<num0>\d+)\s+(?<num1>\d+)\s+(?<num2>\d+)\s+(?<num3>\d+)\s+(?<num4>\d+)\s+(?<num5>\d+)\s+(?<num6>\d+)\s+(?<num7>\d+)\s+(?<num8>\d+)\s+(?<num9>\d+) \|\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split(/(\n|\r)/).filter(l => l.length > 0);
    const cards = [];
    for (const line of lines) {
        const matches = line.match(RE);
        if (!matches) continue;
        const card = {
            cardId: parseInt(matches.groups.card, 10),
            winning: [
                parseInt(matches.groups.num0, 10),
                parseInt(matches.groups.num1, 10),
                parseInt(matches.groups.num2, 10),
                parseInt(matches.groups.num3, 10),
                parseInt(matches.groups.num4, 10),
                parseInt(matches.groups.num5, 10),
                parseInt(matches.groups.num6, 10),
                parseInt(matches.groups.num7, 10),
                parseInt(matches.groups.num8, 10),
                parseInt(matches.groups.num9, 10),
            ],
            numbers: matches.slice(12).map(n => parseInt(n, 10)),
            count: 0,
        };
        cards.push(card);
    }
    return cards;
}

function getPoints(card) {
    const winners = getWinnerCount(card);
    if (winners === 0) return 0;
    return 2**(winners - 1);
}

function getWinnerCount(card) {
    const winners = card.numbers.filter(num => card.winning.includes(num));
    return winners.length;
}

function part1(cards) {
    let total = 0;
    for (const card of cards) {
        const points = getPoints(card);
        total += points;
    }
    console.log(`total points of the cards is ${total}`);
}

function part2(cards) {
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.count++;
        const winnerCount = getWinnerCount(card);
        for (let j = 1; j <= winnerCount; j++) {
            cards[i + j].count += card.count;
        }
    }
    const total = cards.reduce((sum, card) => sum + card.count, 0);
    console.log(`total number of cards: ${total}`);
}

async function main() {
    const cards = await parse();
    part1(cards);
    part2(cards);
}

main();
