# timerel
[![](https://img.shields.io/npm/v/timerel.svg?style=flat)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/npm/dm/timerel.svg)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/bundlephobia/minzip/timerel.svg)](https://bundlephobia.com/package/timerel) [![](https://packagephobia.com/badge?p=timerel)](https://packagephobia.com/result?p=timerel)

`timerel` formats dates to short English relative format `5 mins ago` and does so around [11 times faster](./bench.ts) than [its competition](https://github.com/hustcc/timeago.js).

## Usage

```sh
pnpm add timerel
```

```ts
import {timerel} from "timerel";

console.log(timerel(Date.now() - 1e6));
// => 16 mins ago
```

When formatting multiple dates in a loop, pass `{now: Date.now()}` to avoid repeated `Date.now()` calls internally:

```ts
const now = Date.now();
for (const date of dates) {
  console.log(timerel(date, {now}));
}
```

## API
### timerel(date, opts?)

- `date` *String, Number or Date*: The date to format.

#### Options

- `now` *String, Number or Date*: The date to compare to. Default: `Date.now()`.
- `noAffix` *Boolean*: Whether to omit `ago` and `in` affixes. Default: `false`.
- `times` *Array*: A custom time table that overrides the built-in one. Entries are `[maxMs, unit]`, ascending by `maxMs`, where `unit` is one of `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter` or `year`.
- `nowThreshold` *Number*: Number of milliseconds below which to output `"now"`. Default: 2000.
- `nowString` *String*: String to output for now. Default: `"now"`, localized for other locales.
- `unknownString` *String*: String to output for invalid dates. Default: `String(date)`.
- `aliases` *Boolean*: Use aliases like "yesterday" instead of "1 day ago". Default: `false`.
- `aliasesMap` *Object*: A custom aliases object to use instead of the built-in one. Unused for other locales.
- `longUnits` *Boolean*: Use minutes/seconds instead of mins/secs. Default: `false`.
- `shortUnits` *Boolean*: Use short units like `1d ago`, overriding `longUnits`. Built-in aliases do not match. Default: `false`.
- `locale` *String, Array or Intl.Locale*: Locale like `"de"`, formatted via `Intl` unless `"en"`. Default: `"en"`.
- `format` *Function*: Custom formatter `(num, unit) => string` receiving the count, negative for past dates, and the unit. Overrides all other formatting options except `nowString` and `unknownString`.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
