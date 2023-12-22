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
        x: range.x?.slice() ?? [1, 4000],
        m: range.m?.slice() ?? [1, 4000],
        a: range.a?.slice() ?? [1, 4000],
        s: range.s?.slice() ?? [1, 4000],
    };
}

function part2(data) {
    const {workflows} = data;
    const threads = [{label: 'in', accepted: dupRange({})}];
    const allAccepted = [];
    const allRejected = [];
    while (threads.length > 0) {
        const {label, accepted} = threads.pop();
        console.log('label:', label, JSON.stringify(accepted));
        const workflow = workflows[label];
        console.log('workflow:', JSON.stringify(workflow));
        for (const rule of workflow) {
            if (rule.prop === 'all') {
                if (rule.dest === 'R') {
                    allRejected.push(dupRange(accepted));
                    break;
                }
                if (rule.dest === 'A') {
                    allAccepted.push(dupRange(accepted));
                    break;
                }
                threads.push({label: rule.dest, accepted: dupRange(accepted)});
                break;
            }
            const newAccepted = dupRange(accepted);
            if (rule.op === '<') {
                if (newAccepted[rule.prop][0] >= rule.value) {
                    continue;
                }
                newAccepted[rule.prop][1] = Math.min(newAccepted[rule.prop][1], rule.value - 1);
                if (rule.dest === 'R') {
                    allRejected.push(newAccepted);
                    break;
                }
                if (rule.dest === 'A') {
                    allAccepted.push(newAccepted);
                    break;
                }
                threads.push({label: rule.dest, accepted: newAccepted});
                accepted[rule.prop][0] = rule.value;
            } else {
                if (newAccepted[rule.prop][1] <= rule.value) {
                    continue;
                }
                newAccepted[rule.prop][0] = Math.max(newAccepted[rule.prop][0], rule.value + 1);
                if (rule.dest === 'R') {
                    allRejected.push(newAccepted);
                    break;
                }
                if (rule.dest === 'A') {
                    allAccepted.push(newAccepted);
                    break;
                }
                threads.push({label: rule.dest, accepted: newAccepted});
                accepted[rule.prop][1] = rule.value;
            }
        }
    }
    console.log(`all accepted: ${JSON.stringify(allAccepted, null, 4)}`);
    console.log(`all rejected: ${JSON.stringify(allRejected, null, 4)}`);
    const flatten = allAccepted.reduce(
        (flat, range) => {
            return {
                x: [
                    Math.max(flat.x[0], range.x[0]),
                    Math.min(flat.x[1], range.x[1])
                ],
                m: [
                    Math.max(flat.m[0], range.m[0]),
                    Math.min(flat.m[1], range.m[1])
                ],
                a: [
                    Math.max(flat.a[0], range.a[0]),
                    Math.min(flat.a[1], range.a[1])
                ],
                s: [
                    Math.max(flat.s[0], range.s[0]),
                    Math.min(flat.s[1], range.s[1])
                ]
            }
        }
    );
    console.log(`flattened: ${JSON.stringify(flatten, null, 4)}`)
    const sum = 
        (flatten.x[1] - flatten.x[0] + 1) *
        (flatten.m[1] - flatten.m[0] + 1) *
        (flatten.a[1] - flatten.a[0] + 1) *
        (flatten.s[1] - flatten.s[0] + 1);

    console.log(`sum is ${sum}`);
}

async function main() {
    const data = await parse();
    part1(data);
    part2(data);
}

main();
