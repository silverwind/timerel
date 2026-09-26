import {timerel, type TimesArray} from "./index.ts";
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
  for (const [duration, unit] of [
    [86400000, "day"],
    [604800000, "week"],
    [2628000000, "month"],
    [31536000000, "year"],
  ] as const) {
    expect(timerel(-duration * 2, {now: 0})).toEqual(`2 ${unit}s ago`);
  }

  const now = Date.now();
  for (let i = 0; i < 10000; i++) {
    const val = now - i * 10000;
    expect(timerel(val)).toEqual(format(val).replace("minute", "min").replace("second", "sec").replace("just ", ""));
  }
});

test("aliases", () => {
  expect(timerel(Date.now() - 86500000, {aliases: true})).toEqual("yesterday");
  expect(timerel(Date.now() + 86500000, {aliases: true})).toEqual("tomorrow");
});

test("longUnits", () => {
  expect(timerel(Date.now() - 1e4, {longUnits: true})).toEqual("10 seconds ago");
  expect(timerel(Date.now() - 1e6, {longUnits: true})).toEqual("16 minutes ago");
  expect(timerel(Date.now() - 1e4, {longUnits: true, times: [[1e3, Infinity, "sec", "s", "sekunde"]]})).toEqual("10 sekundes ago");
});

test("shortUnits", () => {
  expect(timerel(Date.now() - 1e4, {shortUnits: true})).toEqual("10s ago");
  expect(timerel(Date.now() - 2628e6, {shortUnits: true})).toEqual("1mo ago");

  const times: TimesArray = [[2e3, 6e4, "sec", "sek"], [9e4, Infinity, "min"]];
  expect(timerel(-1e4, {now: 0, shortUnits: true, times})).toEqual("5sek ago");
  expect(timerel(-1e6, {now: 0, shortUnits: true, times})).toEqual("11min ago");
});

test("unknown", () => {
  expect(timerel("foo")).toEqual("foo");
  expect(timerel("foo", {unknownString: "unknown"})).toEqual("unknown");
});
