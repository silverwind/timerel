import {timerel} from "./index.js";

test("test", () => {
  const ref = Date.now();

  for (let i = 0; i < 1e6; i += 1e3) {
    expect(timerel(ref - i, ref)).toMatch(/^([0-9]+ [a-z]+ ago|just now)/);
    expect(timerel(ref + i, ref)).toMatch(/^(in [0-9]+ [a-z]+|just now)/);
    expect(timerel(ref - i, ref, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|just now)/);
    expect(timerel(ref + i, ref, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|just now)/);
  }
});
