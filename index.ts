export type TimerelAnyDate = string | number | Date;
export type TimesArray = Array<[number, number, string]>;

const defaultTimes: TimesArray = [
  [1e3, 6e4, "sec"],
  [6e4, 36e5, "min"],
  [36e5, 864e5, "hour"],
  [864e5, 6048e5, "day"],
  [6048e5, 2628e6, "week"],
  [2628e6, 31536e6, "month"],
  [31536e6, Infinity, "year"],
];

export type AliasesMap = {
  [key: string]: string,
};

const defaultAliasesMap: AliasesMap = {
  "1 day ago": "yesterday",
  "1 week ago": "last week",
  "1 month ago": "last month",
  "1 year ago": "last year",
  "in 1 day": "tomorrow",
  "in 1 week": "next week",
  "in 1 month": "next month",
  "in 1 year": "next year",
};

export type UnitsMap = {
  [key: string]: string,
};

const longUnitsMap: UnitsMap = {
  sec: "second",
  min: "minute",
};

export type TimerelOpts = {
  /** The date to compare to. Default: `Date.now()`. */
  now?: Date | string | number,
  /** Whether to omit `ago` and `in` affixes. Default: `false`. **/
  noAffix?: boolean,
  /** A custom time table that overrides the built-in one. **/
  times?: TimesArray,
  /** Number of milliseconds below which to output `"now"`. Default: 2000. */
  nowThreshold?: number,
  /** String to output for now. Default: `"now"`. */
  nowString?: string,
  /** String to output for invalid dates. Default: `String(date)`. */
  unknownString?: string,
  /** Use aliases like "yesterday" instead of "1 day ago". Default: `false`. */
  aliases?: boolean,
  /** A custom aliases object to use instead of the built-in one. */
  aliasesMap?: AliasesMap,
  /** Use minutes/secoonds instead of mins/secs. Default: `false`. */
  longUnits?: boolean,
};

function toNum(date: TimerelAnyDate): number {
  if (date instanceof Date) {
    return date.getTime();
  } else if (typeof date === "string") {
    return Date.parse(date);
  }
  return date;
}

/** Format a date to a relative time format */
export function timerel(date: TimerelAnyDate, {now, noAffix = false, times = defaultTimes, nowThreshold = 2000, nowString = "now", unknownString = "", aliases = false, aliasesMap = defaultAliasesMap, longUnits = false}: TimerelOpts = {}) {
  const dateObj = toNum(date);
  now = now !== undefined ? toNum(now) : Date.now();
  if (Number.isNaN(dateObj)) return unknownString || String(date);

  let future = false;
  let diff = now - dateObj;

  if (diff < 0) {
    future = true;
    diff = Math.abs(diff);
  }
  if (diff < nowThreshold) return nowString;

  let num: number = 0;
  let suffix: string = "";
  for (let i = 0, len = times.length; i < len; i++) {
    const time = times[i];
    if (diff >= time[1]) continue;
    num = Math.floor(diff / time[0]);
    suffix = (longUnits ? longUnitsMap[time[2]] || time[2] : time[2]) + (num > 1 ? "s" : "");
    break;
  }

  const result = `${future && !noAffix ? "in " : ""}${num} ${suffix}${!future && !noAffix ? " ago" : ""}`;
  if (!aliases) return result;
  return aliasesMap[result] ?? result;
}
