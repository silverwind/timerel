import {timerel, type TimerelAnyDate, type TimerelOpts, type TimesArray} from "./index.ts";
import {format} from "timeago.js";

test("return value", () => {
  const date = Date.now();
  for (let i = 0; i < 1e6; i += 1e3) {
    for (const input of [date - i, new Date(date - i)]) expect(timerel(input)).toMatch(/^([0-9]+ [a-z]+ ago|now)/);
    for (const input of [date + i, new Date(date + i)]) expect(timerel(input)).toMatch(/^(in [0-9]+ [a-z]+|now)/);
    for (const input of [date - i, date + i]) expect(timerel(input, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|now)/);
  }
});

test("correctness", () => {
  const now = Date.now();
  for (let i = 0; i < 10000; i++) {
    const val = now - i * 10000;
    expect(timerel(val)).toEqual(format(val).replace("minute", "min").replace("second", "sec").replace("just ", ""));
  }
});

test("exact outputs", () => {
  const now = Date.now();
  const times: TimesArray = [[2e3, 6e4, "sec", "sek"], [9e4, Infinity, "min"]];
  const cases: Array<[TimerelAnyDate, TimerelOpts | undefined, string]> = [
    [new Date(0), {now: new Date(1000000)}, "16 mins ago"],
    [0, {now: 0, nowThreshold: 0}, "0 secs ago"],
    [0, {now: 500, nowThreshold: 0, longUnits: true}, "0 seconds ago"],
    [-2 * 864e5, {now: 0}, "2 days ago"],
    [-2 * 6048e5, {now: 0}, "2 weeks ago"],
    [-2 * 2628e6, {now: 0}, "2 months ago"],
    [-2 * 31536e6, {now: 0}, "2 years ago"],
    [now - 86500000, {aliases: true}, "yesterday"],
    [now + 86500000, {aliases: true}, "tomorrow"],
    [now - 1e4, {longUnits: true}, "10 seconds ago"],
    [now - 1e6, {longUnits: true}, "16 minutes ago"],
    [now - 1e4, {longUnits: true, times: [[1e3, Infinity, "sec", "s", "sekunde"]]}, "10 sekundes ago"],
    [now - 1e4, {shortUnits: true}, "10s ago"],
    [now - 2628e6, {shortUnits: true}, "1mo ago"],
    [-1e4, {now: 0, shortUnits: true, times}, "5sek ago"],
    [-1e6, {now: 0, shortUnits: true, times}, "11min ago"],
    ["foo", undefined, "foo"],
    ["foo", {unknownString: "unknown"}, "unknown"],
  ];
  expect(cases.map(([date, opts]) => timerel(date, opts))).toEqual(cases.map((testCase) => testCase[2]));
});
