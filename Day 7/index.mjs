import fs from 'fs/promises';

const HandValue = {
    HIGH_CARD: 0,
    ONE_PAIR: 1,
    TWO_PAIR: 2,
    THREE_KIND: 3,
    FULL_HOUSE: 4,
    FOUR_KIND: 5,
    FIVE_KIND: 6,
};
const CardValue = {
    2: 0,
    3: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
    8: 6,
    9: 7,
    T: 8,
    J: 9,
    Q: 10,
    K: 11,
    A: 12,
};

function evaluateHand(cards) {
    const map = new Map();
    for (const card of cards) {
        if (!map.has(card)) map.set(card, 0);
        map.set(card, map.get(card) + 1);
    }
    if (map.size === 1) {
        return HandValue.FIVE_KIND;
    }
    if (map.size === 5) {
        return HandValue.HIGH_CARD;
    }
    if (map.size === 4) {
        return HandValue.ONE_PAIR;
    }
    let hasThreeKind = false;
    let pairCount = 0
    for (const count of map.values()) {
        if (count === 4) {
            return HandValue.FOUR_KIND;
        }
        if (count === 3) {
            hasThreeKind = true;
        }
        if (count === 2) {
            pairCount++;
        }
    }
    if (hasThreeKind) {
        if (pairCount === 1) {
            return HandValue.FULL_HOUSE;
        }
        return HandValue.THREE_KIND;
    }
    if (pairCount === 1) {
        return HandValue.ONE_PAIR;
    }
    if (pairCount === 2) {
        return HandValue.TWO_PAIR;
    }
    throw new Error(`invalid hand map: ${JSON.stringify([...map.entries()])}, ${cards.join('')}`);
}

function evaluateHandWithJokers(cards) {
    const map = new Map();
    for (const card of cards) {
        if (!map.has(card)) map.set(card, 0);
        map.set(card, map.get(card) + 1);
    }
    // no jokers, normal eval
    if (!map.has('J')) return evaluateHand(cards);
    // oops all jokers
    if (map.size === 1) {
        return HandValue.FIVE_KIND;
    }
    const jokerCount = map.get('J');
    map.delete('J');
    if (map.size === 1) {
        return HandValue.FIVE_KIND;
    }
    if (map.size === 4) {
        return HandValue.ONE_PAIR;
    }

    let pairCount = 0
    for (const count of map.values()) {
        if (count === 4) {
            return HandValue.FOUR_KIND;
        }
        if (count === 3) {
            return HandValue.FOUR_KIND;
        }
        if (count === 2) {
            pairCount++;
        }
    }
    if (pairCount === 0) {
        if (jokerCount === 1) {
            return HandValue.ONE_PAIR;
        }
        if (jokerCount === 2) {
            return HandValue.THREE_KIND;
        }
        return HandValue.FOUR_KIND;
    }
    if (pairCount === 1) {
        if (jokerCount === 1) {
            return HandValue.THREE_KIND;
        }
        if (jokerCount === 2) {
            return HandValue.FOUR_KIND;
        }
    }
    if (pairCount === 2) {
        return HandValue.FULL_HOUSE;
    }
    throw new Error(`invalid hand map: ${JSON.stringify([...map.entries()])}, ${cards.join('')}`);
}

function sortHands(a, b, withJokers = false) {
    if (a[0] !== b[0]) {
        if (withJokers && a[0] === 'J') return -1;
        if (withJokers && b[0] === 'J') return 1;
        return CardValue[a[0]] - CardValue[b[0]];
    }
    if (a[1] !== b[1]) {
        if (withJokers && a[1] === 'J') return -1;
        if (withJokers && b[1] === 'J') return 1;
        return CardValue[a[1]] - CardValue[b[1]];
    }
    if (a[2] !== b[2]) {
        if (withJokers && a[2] === 'J') return -1;
        if (withJokers && b[2] === 'J') return 1;
        return CardValue[a[2]] - CardValue[b[2]];
    }
    if (a[3] !== b[3]) {
        if (withJokers && a[3] === 'J') return -1;
        if (withJokers && b[3] === 'J') return 1;
        return CardValue[a[3]] - CardValue[b[3]];
    }
    if (withJokers && a[4] === 'J') return -1;
    if (withJokers && b[4] === 'J') return 1;
    return CardValue[a[4]] - CardValue[b[4]];
}

const RE = /^([AKQJT98765432])([AKQJT98765432])([AKQJT98765432])([AKQJT98765432])([AKQJT98765432]) (?<bet>\d+)$/;
async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split(/[\n\r]/).filter(l => l.length > 0);
    const hands = [];
    for (const line of lines) {
        const match = line.match(RE);
        if (!match) throw new Error(`${match} '${line}' ${line.length}`);
        const cards = match.slice(1, 6);
        const value = evaluateHand(cards);
        const jValue = evaluateHandWithJokers(cards);
        hands.push({
            cards,
            value,
            jValue,
            bet: parseInt(match.groups.bet, 10),
        });
    }
    return hands;
}

function part1(hands) {
    const sorted = hands.slice().sort((a, b) => {
        if (a.value === b.value) {
            return sortHands(a.cards, b.cards);
        }
        return a.value - b.value;
    });
    let total = 0;
    for (let i = 0; i < sorted.length; i++) {
        total += (i + 1) * sorted[i].bet;
    }
    console.log(`the total winnings are ${total}`);
}

function part2(hands) {
    const sorted = hands.slice().sort((a, b) => {
        if (a.jValue === b.jValue) {
            return sortHands(a.cards, b.cards, true);
        }
        return a.jValue - b.jValue;
    });
    let total = 0;
    for (let i = 0; i < sorted.length; i++) {
        total += (i + 1) * sorted[i].bet;
    }
    for (let i = 0; i < 5; i++) {
        console.log(sorted[i].cards.join(''), sorted[i].jValue);
    }
    console.log(`the total winnings are ${total}`);
}

async function main() {
    const hands = await parse();
    part1(hands);
    part2(hands);
}

main();