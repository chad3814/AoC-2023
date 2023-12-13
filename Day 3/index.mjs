import fs from 'fs/promises';

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
    const lines = input.split(/\s/);
    const grid = [];
    for (const line of lines) {
        if (line.length === 0) continue;
        grid.push(line.split(''));
    }
    return grid;
}

function findSymbols(grid) {
    const positions = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x].match(/(\d|\.)/)) continue;
            positions.push([x,y]);
        }
    }
    return positions;
}

function getNumberStartPosition(row, x) {
    let i;
    for (i = x - 1; i >= 0; i--) {
        if (!row[i].match(/\d/)) break;
    }
    return i + 1;
}

function positionAlreadyExists(partNumberPositions, x, y) {
    const parts = partNumberPositions[y];
    if (!parts) return false;
    return parts.includes(x);
}

function addIfNumber(partNumberPositions, grid, x, y) {
    const i = getNumberStartPosition(grid[y], x);
    if (!positionAlreadyExists(partNumberPositions, i, y)) {
        partNumberPositions[y].push(i);
    }
}

function getPartNumber(row, x) {
    let j;
    for (j = x; j < row.length; j++) {
        if (!row[j].match(/\d/)) break;
    }
    const num = row.slice(x, j).join('');
    return parseInt(num, 10);
}

function part1(grid) {
    const symbolPositions = findSymbols(grid);
    const partNumberPositions = {};
    for (const [x, y] of symbolPositions) {
        // row above
        if (y > 0) {
            if (!partNumberPositions[y - 1]) {
                partNumberPositions[y - 1] = [];
            }
            if (grid[y - 1][x].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x, y - 1);
            }
            if (x > 0) {
                if (grid[y - 1][x - 1].match(/\d/)) {
                    addIfNumber(partNumberPositions, grid, x - 1, y - 1);
                }
            }
            if (x < grid[y - 1].length - 1 && grid[y - 1][x + 1].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x + 1, y - 1);
            }
        }

        // this row
        if (!partNumberPositions[y]) {
            partNumberPositions[y] = [];
        }
        if (grid[y][x - 1].match(/\d/)) {
            addIfNumber(partNumberPositions, grid, x - 1, y);
        }
        if (x < grid[y].length - 1 && grid[y][x + 1].match(/\d/)) {
            addIfNumber(partNumberPositions, grid, x + 1, y);
        }
        
        // row below
        if (y < grid.length - 1) {
            if (!partNumberPositions[y + 1]) {
                partNumberPositions[y + 1] = [];
            }
            if (grid[y + 1][x].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x, y + 1);
            }
            if (x > 0) {
                if (grid[y + 1][x - 1].match(/\d/)) {
                    addIfNumber(partNumberPositions, grid, x - 1, y + 1);
                }
            }
            if (x < grid[y + 1].length - 1 && grid[y + 1][x + 1].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x + 1, y + 1);
            }
        }
    }
    let total = 0;
    for (const y of Object.keys(partNumberPositions)) {
        for (const x of partNumberPositions[y]) {
            total += getPartNumber(grid[y], x);
        }
    }
    console.log(`the sum of the part numbers is: ${total}`);
}

function part2(grid) {
    const gearPositions = findSymbols(grid).filter(([x, y]) => grid[y][x] === '*');
    let total = 0;
    for (const [x, y] of gearPositions) {
        const partNumberPositions = { [y - 1]: [], [y]: [], [y + 1]: [] };
        // row above
        if (y > 0) {
            if (grid[y - 1][x].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x, y - 1);
            }
            if (x > 0) {
                if (grid[y - 1][x - 1].match(/\d/)) {
                    addIfNumber(partNumberPositions, grid, x - 1, y - 1);
                }
            }
            if (x < grid[y - 1].length - 1 && grid[y - 1][x + 1].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x + 1, y - 1);
            }
        }

        // this row
        if (grid[y][x - 1].match(/\d/)) {
            addIfNumber(partNumberPositions, grid, x - 1, y);
        }
        if (x < grid[y].length - 1 && grid[y][x + 1].match(/\d/)) {
            addIfNumber(partNumberPositions, grid, x + 1, y);
        }
        
        // row below
        if (y < grid.length - 1) {
            if (grid[y + 1][x].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x, y + 1);
            }
            if (x > 0) {
                if (grid[y + 1][x - 1].match(/\d/)) {
                    addIfNumber(partNumberPositions, grid, x - 1, y + 1);
                }
            }
            if (x < grid[y + 1].length - 1 && grid[y + 1][x + 1].match(/\d/)) {
                addIfNumber(partNumberPositions, grid, x + 1, y + 1);
            }
        }
        const totalParts = partNumberPositions[y - 1].length + partNumberPositions[y].length + partNumberPositions[y + 1].length;
        if (totalParts === 2) {
            let gearRatio = 1;
            for (const y of Object.keys(partNumberPositions)) {
                for (const x of partNumberPositions[y]) {
                    gearRatio *= getPartNumber(grid[y], x);
                }
            }
            total += gearRatio;
        }
    }
    console.log(`the sum of the gear ratios is ${total}`);
}

async function main() {
    const grid = await parse();
    part1(grid);
    part2(grid);
}

main();