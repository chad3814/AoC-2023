import fs from 'fs/promises';

const WORKFLOW_RE = /^(?<label>[^\{]+)\{(?<rules>[^\}]+)\}$/;
const RULE_RE = /((?<prop>[xmas])(?<op>[><])(?<val>\d+):)?(?<dest>.*)/;
const PART_X_RE = /x=(?<x>\d+)/;
const PART_M_RE = /m=(?<m>\d+)/;
const PART_A_RE = /a=(?<a>\d+)/;
const PART_S_RE = /s=(?<s>\d+)/;

function getXComp(op, val) {
    return function (x, m, a, s) {
        return (op === '<' ? x < val : x > val)
    }
}
function getMComp(op, val) {
    return function (x, m, a, s) {
        return (op === '<' ? m < val : m > val)
    }
}
function getAComp(op, val) {
    return function (x, m, a, s) {
        return (op === '<' ? a < val : a > val)
    }
}
function getSComp(op, val) {
    return function (x, m, a, s) {
        return (op === '<' ? s < val : s > val)
    }
}
function all() {
    return true;
}
async function parse() {
    // const input = await fs.readFile('./input.txt', 'utf-8');
    const input =
`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const workflows = {};
    const parts = [];
    for (const line of lines) {
        const workflow = line.match(WORKFLOW_RE);
        if (workflow) {
            const label = workflow.groups.label;
            const rulesRaw =  workflow.groups.rules.split(',');
            const rules = [];
            for (const ruleRaw of rulesRaw) {
                const match = ruleRaw.match(RULE_RE);
                const rule = {
                    str: `${match.groups.prop} ${match.groups.op} ${match.groups.val}`,
                    dest: match.groups.dest,
                    prop: match.groups.prop ?? 'all',
                    op: match.groups.op ?? 'all',
                };
                switch (match.groups.prop) {
                    case 'x':
                        rule.value = parseInt(match.groups.val, 10);
                        rule.f = getXComp(match.groups.op, rule.value);
                        break;
                    case 'm':
                        rule.value = parseInt(match.groups.val, 10);
                        rule.f = getMComp(match.groups.op, rule.value);
                        break;
                    case 'a':
                        rule.value = parseInt(match.groups.val, 10);
                        rule.f = getAComp(match.groups.op, rule.value);
                        break;
                    case 's':
                        rule.value = parseInt(match.groups.val, 10);
                        rule.f = getSComp(match.groups.op, rule.value);
                        break;
                    default:
                        rule.value = 4000;
                        rule.str = `default => ${match.groups.dest}`;
                        rule.f = all;
                }
                rules.push(rule);
            }
            workflows[label] = rules;
            continue;
        }
        const part = {};
        let match = line.match(PART_X_RE);
        if (!match) {
            throw new Error(`line "${line}" doesn't match workflow or part x`);
        }
        part.x = parseInt(match.groups.x, 10);
        match = line.match(PART_M_RE);
        part.m = parseInt(match.groups.m, 10);
        match = line.match(PART_A_RE);
        part.a = parseInt(match.groups.a, 10);
        match = line.match(PART_S_RE);
        part.s = parseInt(match.groups.s, 10);
        parts.push(part);
    }
    return {workflows, parts};
}

function part1(data) {
    const {workflows, parts} = data;
    let sum = 0;
    for (const part of parts) {
        let label = 'in';
        // console.log(JSON.stringify(part));
        while (label !== 'A' && label !== 'R') {
            const rules = workflows[label];
            for (const rule of rules) {
                if (rule.f(part.x, part.m, part.a, part.s)) {
                    // console.log(`matches ${rule.str} => ${rule.dest}`);
                    label = rule.dest;
                    break;
                }
            }
        }
        if (label === 'A') {
            sum += part.x + part.m + part.a + part.s;
        }
    }
    console.log(`sum of accepted parts: ${sum}`);
}

function reduceRanges(a, b) {
    console.log(`reduce a ${JSON.stringify(a, null, 4)}`);
    console.log(`reduce b ${JSON.stringify(b, null, 4)}`);
    const ranges = {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
    };
    for (const prop of ['x', 'm', 'a', 's']) {
        const [aStart, aEnd] = a[prop];
        const [bStart, bEnd] = b[prop];
        if (
            (aStart <= bStart && bStart <= aEnd) ||
            (bStart <= aStart && aStart <= bEnd) 
        ) {
            ranges[prop] = [Math.max(aStart, bStart), Math.min(aEnd, b.End)];
        } else {
            ranges[prop] = [];
        }
    }
    return ranges;
}

function rangesValue(ranges) {
    let value = 0;
    for (const range of ranges) {
        for (const prop of ['x', 'm', 'a', 's']) {
            const sum = range[prop][1] - range[prop][0] + 1;
            value += (4000 - sum);
        }
    }
    return value;
}

function dupRange(range) {
    return {
        x: range.x.slice(),
        m: range.m.slice(),
        a: range.a.slice(),
        s: range.s.slice(),
    };
}

function part2(data) {
    const {workflows} = data;
    const rangesMap = new Map;
    rangesMap.set('in', [
        {
            x: [1, 4000],
            m: [1, 4000],
            a: [1, 4000],
            s: [1, 4000],
        }
    ]);
    const threads = ['in'];
    while (threads.length > 0) {
        const label = threads.pop();
        let ranges = rangesMap.get(label);
        if (!ranges || ranges.some(r => !r)) {
            throw new Error(`invalid ranges set for label "${label}" ${JSON.stringify(ranges)} ${ranges.length}`);
        }
        const workflow = workflows[label];
        for (const rule of workflow) {
            if (rule.prop === 'all') {
                threads.push(rule.dest);
                const existing = rangesMap.get(rule.dest) ?? [];
                existing.push(ranges.map(r => dupRange(r)));
                rangesMap.set(rule.dest, existing);
                break;
            }
            const ruleRangeTrue = {
                x: [1, 4000],
                m: [1, 4000],
                a: [1, 4000],
                s: [1, 4000],
            };
            const ruleRangeFalse = {
                x: [1, 4000],
                m: [1, 4000],
                a: [1, 4000],
                s: [1, 4000],
            };
            ruleRangeTrue[rule.prop] = rule.op === '<' ?
                [1, rule.value -1] :
                [rule.value + 1, 4000];
            ruleRangeFalse[rule.prop] = rule.op === '<' ?
                [rule.value, 4000] :
                [1, rule.value];
            console.log(`label: ${label}; dest: ${rule.dest}`);
            console.log(`ranges: ${JSON.stringify(ranges)}`);
            console.log(`true range: ${JSON.stringify(ruleRangeTrue)}`);
            console.log(`false range: ${JSON.stringify(ruleRangeFalse)}`);
            const newRanges = ranges.map(range => reduceRanges(range, ruleRangeTrue));
            console.log(`new ranges for true branch: ${JSON.stringify(newRanges)}`);
            const existing = rangesMap.get(rule.dest) ?? [];
            existing.push(...newRanges);
            rangesMap.set(rule.dest, existing);
            ranges = ranges.map(range => reduceRanges(range, ruleRangeFalse));
            console.log(`new ranges for false branch: ${JSON.stringify(ranges)}`);
        }
    }
    const ranges = rangesMap.get('A');
    const sum = rangesValue(ranges);
    console.log(`total possible acceptable parts: ${sum}`);
}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
