import {timerel} from "./index.js";
import {format} from "timeago.js";

test("test", () => {
  const date = Date.now();
  for (let i = 0; i < 1e6; i += 1e3) {
    expect(timerel(date - i)).toMatch(/^([0-9]+ [a-z]+ ago|now)/);
    expect(timerel(date + i)).toMatch(/^(in [0-9]+ [a-z]+|now)/);
    expect(timerel(new Date(date - i))).toMatch(/^([0-9]+ [a-z]+ ago|now)/);
    expect(timerel(new Date(date + i))).toMatch(/^(in [0-9]+ [a-z]+|now)/);
    expect(timerel(date - i, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|now)/);
    expect(timerel(date + i, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|now)/);
  }
});

test("correctness", () => {
  const now = Date.now();
  for (let i = 0; i < 1000000; i++) {
    const val = now - i * 100000;
    const a = timerel(val);
    const b = format(val).replace("minute", "min").replace("second", "sec").replace("just ", "");
    expect(a).toEqual(b);
  }
});
