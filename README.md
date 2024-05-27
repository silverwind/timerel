# timerel
[![](https://img.shields.io/npm/v/timerel.svg?style=flat)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/npm/dm/timerel.svg)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/bundlephobia/minzip/timerel.svg)](https://bundlephobia.com/package/timerel) [![](https://packagephobia.com/badge?p=timerel)](https://packagephobia.com/result?p=timerel)

`timerel` formats dates to short english relative format `5 mins ago` and does so around [11 times faster](./bench.ts) than [its competition](https://github.com/hustcc/timeago.js).

## Usage

```ts
import {timerel} from "timerel";

console.log(timerel(Date.now() - 1e6));
// => 16 mins ago
```

## API
### timerel(date, opts?)

- `date` *String, Number or Date*: The date to format.

#### Options

- `now` *String, Number or Date*: The date to compare to. Default: `Date.now()`.
- `noAffix` *Boolean*: Whether to omit `ago` and `in` affixes. Default: `false`.
- `times` *Array*: A custom time table that overrides the built-in one.
- `nowThreshold` *Number*: Number of milliseconds below which to output `"now"`. Default: 2000.
- `nowString` *String*: String to output for now. Default: `"now"`.
- `unknownString` *String*: String to output for invalid dates. Default: `String(date)`.
- `aliases` *Boolean*: Use aliases like "yesterday" instead of "1 day ago". Default: `false`.
- `aliasesMap` *Object*: A custom aliases object to use instead of the built-in one.
- `longUnits` *Boolean*: Use minutes/secoonds instead of mins/secs. Default: `false`.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
