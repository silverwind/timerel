import {reltime} from "./index.js";

test("compatible", () => {
  const ref = Date.now();

  for (let i = 0; i < 1e6; i += 1e3) {
    expect(reltime(ref - i, ref)).toMatch(/^([0-9]+ [a-z]+ ago|just now)/);
    expect(reltime(ref + i, ref)).toMatch(/^(in [0-9]+ [a-z]+|just now)/);
    expect(reltime(ref - i, ref, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|just now)/);
    expect(reltime(ref + i, ref, {noAffix: true})).toMatch(/^([0-9]+ [a-z]+|just now)/);
  }
});
