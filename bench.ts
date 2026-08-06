import {format} from "timeago.js";
import {timerel} from "./index.ts";

const runs = Number(process.env.BENCH_RUNS) || 5;
const filter = process.env.BENCH_FILTER;

// Results escape here, otherwise V8 deletes the measured work outright.
let sink: unknown;

function bench(name: string, ops: number, fn: (arg: number) => unknown): void {
  if (filter && !name.includes(filter)) return;
  for (let i = 0; i < ops; i++) sink = fn(i); // warmup
  const times: number[] = [];
  for (let run = 0; run < runs; run++) {
    const start = performance.now();
    for (let i = 0; i < ops; i++) sink = fn(i);
    times.push((performance.now() - start) * 1e6 / ops);
  }
  times.sort((a, b) => a - b);
  console.info(`${name.padEnd(10)}${times[runs >> 1].toFixed(1).padStart(9)} ns/op`);
}

const now = Date.now();
const ops = 1e6;

bench("timerel", ops, (i) => timerel(now - i * 100000));
bench("timeago", ops, (i) => format(now - i * 100000));

if (sink === undefined) console.error("sink is empty, results were optimized away");
