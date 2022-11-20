# timerel
[![](https://img.shields.io/npm/v/timerel.svg?style=flat)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/npm/dm/timerel.svg)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/bundlephobia/minzip/timerel.svg)](https://bundlephobia.com/package/timerel)

`timerel` formats dates to short english relative format `5 mins ago` and does so around [9 times faster](./bench.js) than [its competition](https://github.com/hustcc/timeago.js).

## Usage

```js
import {timerel} from "timerel";

console.log(timerel(Date.now() - 1e6));
// => 16 mins ago
```

## API
### timerel(date, {noAffix} = {})

- `date` *String, Number or Date*: The date to format
- `noAffix` *Boolean*: Whether to omit `ago` and `in` affixes. Default: `false`
- `times` *Array*: A custom time table that overrides the built-in one.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
