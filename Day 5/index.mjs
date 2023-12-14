import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split('\n').filter(l => l.length > 0);
    const seeds = lines.shift().match(/\s(\d+)/g).map(n => parseInt(n, 10));
    const maps = [];
    let map;
    for (const line of lines) {
        let match = line.match(/^(?<name>[^:]+):$/);
        if (match) {
            map = [];
            maps.push(map);
            continue;
        }
        match = line.match(/^(?<dest_start>\d+) (?<src_start>\d+) (?<len>\d+)/);
        map.push([
            parseInt(match.groups.src_start, 10),
            parseInt(match.groups.dest_start, 10),
            parseInt(match.groups.len, 10)
        ]);
    }
    return {seeds, maps};
}

function mapSrcToDest(src, map) {
    for (const [src_start, dest_start, len] of map) {
        if (src >= src_start && src < (src_start + len)) {
            const offset = src - src_start;
            return dest_start + offset;
        }
    }
    return src;
}

function part1(data) {
    const {seeds, maps} = data;
    const res = [];
    for (const seed of seeds) {
        let src = seed;
        for (const map of maps) {
            src = mapSrcToDest(src, map);
        }
        res.push(src);
    }
    for(let i = 0; i < seeds.length; i++) {
        console.log(`seed ${seeds[i]} ends at ${res[i]}`);
    }
    console.log(`lowest is ${Math.min.apply(Math, res)}`);
}

function mapSrcRangeToDest(src, srcLen, map) {
    for (const [srcStart, destStart, len] of map) {
        if (src >= srcStart && src < (srcStart + len)) {
            const offset = src - srcStart;
            const remaining = len - offset;
            if (remaining > srcLen) {
                return [[destStart + offset, srcLen]];
            }
            const ret = [[destStart + offset, remaining]];
            return ret.concat(mapSrcRangeToDest(src + remaining, srcLen - remaining, map));
        }
    }
    return [[src, srcLen]];
}

function part2(data) {
    const {seeds: seedRanges, maps} = data;
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < seedRanges.length; i += 2) {
        let ranges = [[seedRanges[i], seedRanges[i+1]]];
        for (const map of maps) {
            let newRanges = [];
            for (const [src, srcLen] of ranges) {
                const ret = mapSrcRangeToDest(src, srcLen, map);
                newRanges = newRanges.concat(ret);
            }
            ranges = newRanges;
        }
        const rangeStarts = ranges.map(r => r[0]);
        min = Math.min(min, ...rangeStarts);
    }
    console.log(`lowest location is ${min}`);
}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
