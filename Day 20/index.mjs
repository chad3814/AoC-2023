import fs from 'fs/promises';

// %hf -> qk, mk
const RE = /^(?<type>[%&])?(?<label>[^\s]+) -> (?<outputs>.*)$/;

class Component {
    constructor(machine, label) {
        this.label = label;
        this.machine = machine;
        this.outputs = [];
        this.inputs = [];
        this.type = 'bare';
    }
    pulse() {}
    addOutput(component) {
        this.outputs.push(component);
    }
    addInput(component) {
        this.inputs.push(component);
    }
    sendPulse(isHigh) {
        for (const output of this.outputs) {
            this.machine.sendPulse(isHigh, output, this);
        }
    }
    isDefaultState() {
        return true;
    }
    toJSON() {
        return {
            label: this.label,
            inputs: this.inputs.map(i => i.label),
            outputs: this.outputs.map(o => o.label),
        }
    }
}
class Broadcaster extends Component {
    type = 'broadcaster';
    pulse(isHigh) {
        this.sendPulse(isHigh);
    }
}
class FlipFlop extends Component {
    type = 'flipflop';
    value = false;
    pulse(isHigh) {
        if (!isHigh) {
            this.value = !this.value;
            this.sendPulse(this.value);
        }
    }
    isDefaultState() {
        // console.log(`flipflop value: ${this.value}`);
        return !this.value;
    }
    toJSON() {
        const obj = super.toJSON();
        obj.value = this.value;
        return obj;
    }
}
class Conjunction extends Component {
    type = 'conjunction';
    lastValues = {};
    pulse(isHigh, fromComponent) {
        this.lastValues[fromComponent.label] = isHigh;
        const allHigh = Object.values(this.lastValues).every(
            wasHigh => wasHigh
        );
        this.sendPulse(!allHigh);
    }
    addInput(component) {
        super.addInput(component);
        this.lastValues[component.label] = false;
    }
    isDefaultState() {
        // console.log(`conjunction lastValues: ${JSON.stringify(this.lastValues)}`);
        return Object.values(this.lastValues).every(wasHigh => !wasHigh);
    }
    toJSON() {
        const obj = super.toJSON();
        obj.lastValues = Object.assign({}, this.lastValues);
        return obj;
    }
}
class Machine {
    constructor(circuit) {
        this.queue = [];
        this.components = {};
        this.lowsSent = 0;
        this.highsSent = 0;
        for (const label of Object.keys(circuit)) {
            const componentRaw = circuit[label];
            if (componentRaw.type === '%') {
                this.components[label] = new FlipFlop(this, label);
            } else if (componentRaw.type === '&') {
                this.components[label] = new Conjunction(this, label);
            } else if (label === 'broadcaster') {
                this.components[label] = new Broadcaster(this, label);
            } else {
                this.components[label] = new Component(this, label);
            }
        }
        for (const label of Object.keys(circuit)) {
            const componentRaw = circuit[label];
            const component = this.components[label];
            if (!component) throw new Error(`missing component "${componentRaw.label}"`);
            for (const output of componentRaw.outputs) {
                let outputComponent = this.components[output];
                if (!outputComponent) {
                    outputComponent = new Component(this, output);
                    this.components[output] = outputComponent;
                }
                if (!outputComponent) throw new Error(`couldn't find output component ${output} from ${label}`);
                outputComponent.addInput(component);
                component.addOutput(outputComponent);
            }
        }
    }
    pushButton() {
        const broadcaster = this.components.broadcaster;
        if (!broadcaster) throw new Error(`no broadcaster component`);
        this.sendPulse(false, broadcaster, {label: 'Button'});
        this.run();
    }
    sendPulse(isHigh, component, fromComponent) {
        this.lowsSent += isHigh ? 0 : 1;
        this.highsSent += isHigh ? 1 : 0;
        this.queue.push({isHigh, component, fromComponent});
    }
    run() {
        do {
            const {isHigh, component, fromComponent} = this.queue.shift();
            component.pulse(isHigh, fromComponent);
            // console.log(`${fromComponent.label} => ${isHigh} => ${component.label}; ${this.queue.length}`)
        } while (this.queue.length > 0);
    }
    isDefaultState() {
        for (const [label, component] of Object.entries(this.components)) {
            // console.log(`${label} => ${component.isDefaultState()}`);
        }
        return Object.values(this.components).every(component => component.isDefaultState());
    }
    getComponent(label) {
        return this.components[label];
    }
}

async function parse() {
    const input = await fs.readFile('./input.txt', 'utf-8');
//     const input =
// `broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a`;
//     const input =
// `broadcaster -> a
// %a -> inv, con
// &inv -> b
// %b -> con
// &con -> output`;
    const lines = input.split('\n').filter(l => l.length > 0);
    const circuit ={};
    for (const line of lines) {
        const match = line.match(RE);
        if (!match) throw new Error(`invalid line "${line}"`);
        const outputs = match.groups.outputs.split(', ');
        circuit[match.groups.label] = {
            type: match.groups.type ?? 'none',
            outputs,
        };
    }
    return circuit;
}

function part1(circuit) {
    const machine = new Machine(circuit);
    let defaults = 0;
    for (let i = 0; i < 1000; i++) {
        machine.pushButton();
        defaults += machine.isDefaultState() ? 1 : 0;
        // console.log(`isDefaultState: ${machine.isDefaultState()}`);
    }
    console.log(`lows: ${machine.lowsSent}; highs: ${machine.highsSent}; product: ${machine.lowsSent * machine.highsSent}; defaults: ${defaults}`);
}

function whatsItTake(component, signal) {
    // what does it take for this component to send this signal?
    const inputLabels = component.inputs.map(c => c.label);
    if (component.type === 'broadcaster') {
        console.log(`one of ${inputLabels.join(', ')} to send ${signal}`);
    }
    if (component.type === 'flipflop') {
        if (signal) {
            console.log(`odd number of low signals from ${inputLabels.join(', ')}`);
        } else {
            console.log(`even number of low signals from ${inputLabels.join(', ')}`);
        }
    }
    if (component.type === 'conjunction') {
        if (signal) {
            console.log(`high pulses from all of ${inputLabels.join(', ')}`);
        } else {
            console.log(`at least one low pulse from ${inputLabels.join(', ')}`);
        }
    }

}
function part2(circuit) {
    const machine = new Machine(circuit);
    const rx = machine.getComponent('rx');
    rx.signal = (isHigh) => console.log(`got a ${isHigh} signal`);
    for (let i = 0; i < 32; i++) {
        machine.pushButton();
    }
    console.log(JSON.stringify(machine, null, 4));
}

async function main() {
    const circuit = await parse();
    // part1(circuit);
    part2(circuit);
}

main();
