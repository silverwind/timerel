import {format} from "timeago.js";
import {timerel} from "./index.js";

const now = Date.now();
const t1 = performance.now();
for (let i = 0; i < 1000000; i++) timerel(now - i * 100000);
console.info(`timerel: ${Math.round(performance.now() - t1)}ms`);
const t2 = performance.now();
for (let i = 0; i < 1000000; i++) format(now - i * 100000);
console.info(`timeago: ${Math.round(performance.now() - t2)}ms`);
