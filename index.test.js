import {timerel} from "./index.js";
import {format} from "timeago.js";

test("return value", () => {
  const date = Date.now();
  for (let i = 0; i < 1e6; i += 1e3) {
    expect(timerel(date - i)).toMatch(/^([0-9]+ [a-z]+ ago|now)/);
    expect(timerel(date + i)).toMatch(/^(in [0-9]+ [a-z]+|now)/);
    expect(timerel(new Date(date - i))).toMatch(/^([0-9]+ [a-z]+ ago|now)/);
    expect(timerel(new Date(date + i))).toMatch(/^(in [0-9]+ [a-z]+|now)/);
    expect(timerel(date - i, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|now)/);
    expect(timerel(date + i, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|now)/);
  }

  expect(timerel(new Date(0), {now: new Date(1000000)})).toEqual("16 mins ago");
});

test("correctness", () => {
  const now = Date.now();
  for (let i = 0; i < 100000; i++) {
    const val = now - i * 10000;
    const a = timerel(val);
    const b = format(val).replace("minute", "min").replace("second", "sec").replace("just ", "");
    expect(a).toEqual(b);
  }
});

test("aliases", () => {
  const now = Date.now();
  expect(timerel(now - 86500000, {aliases: true})).toEqual("yesterday");
  expect(timerel(now + 86500000, {aliases: true})).toEqual("tomorrow");
});
