import {timerel} from "./index.ts";
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
  expect(timerel(Date.now() - 86500000, {aliases: true})).toEqual("yesterday");
  expect(timerel(Date.now() + 86500000, {aliases: true})).toEqual("tomorrow");
});

test("longUnits", () => {
  expect(timerel(Date.now() - 1e4, {longUnits: true})).toEqual("10 seconds ago");
  expect(timerel(Date.now() - 1e6, {longUnits: true})).toEqual("16 minutes ago");
});

test("unknown", () => {
  expect(timerel("foo")).toEqual("foo");
  expect(timerel("foo", {unknownString: "unknown"})).toEqual("unknown");
});
