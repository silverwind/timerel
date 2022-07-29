# timerel
[![](https://img.shields.io/npm/v/timerel.svg?style=flat)](https://www.npmjs.org/package/timerel) [![](https://img.shields.io/npm/dm/timerel.svg)](https://www.npmjs.org/package/timerel)

`timerel` formats dates to english relative format `5 mins ago` and does so around 8 times faster than its competition.

## Usage

```js
import {timerel} from "timerel";

console.log(timerel(Date.now() - 1e6));
// => 16 mins ago
```

## API
### timerel(date, [reference], [{noAffix}])

- `date` *String, Number or Date*: the date to format
- `reference` *String, Number or Date*: the reference date to compare to. Default: `Date.now()`.
- `noAffix` *Boolean* whether to omit `ago` and `in` affixes

© [silverwind](https://github.com/silverwind), distributed under BSD licence
