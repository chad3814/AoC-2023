function part1(races) {
    let total = 1;
    for (const race of races) {
        const halfTime = race.time >> 1;
        let wins = 0;
        for (let t = 1; t <= halfTime; t++) {
            const distance = t * (race.time - t);
            if (distance > race.distance) wins++;
        }
        if (race.time % 2) {
            total *= (wins * 2);
        } else {
            total *= ((wins - 1) * 2) + 1;
        }
    }
    console.log(`race winnings multiplied together: ${total}`);
}

function part2(races) {
    const time = parseInt(races.map(race =>
        race.time.toString(10)
    ).join(''), 10);
    const distance = parseInt(races.map(race =>
        race.distance.toString(10)
    ).join(''), 10);
    part1([{time, distance}]);
}

function main() {
    const races = [
        {
            time: 41,
            distance: 244,
        },
        {
            time: 66,
            distance: 1047,
        },
        {
            time: 72,
            distance: 1228,
        },
        {
            time: 66,
            distance: 1040,
        }
    ];
    part1(races);
    part2(races);
}

main();
