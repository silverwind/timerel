import {timerel} from "./index.js";

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
