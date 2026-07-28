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

export type AliasesMap = Record<string, string>;

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

export type UnitsMap = Record<string, string>;

const longUnitsMap: UnitsMap = {
  sec: "second",
  min: "minute",
};

export type TimerelOpts = {
  /** The date to compare to. Default: `Date.now()`. */
  now?: TimerelAnyDate,
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
  /** Use minutes/seconds instead of mins/secs. Default: `false`. */
  longUnits?: boolean,
};

function toNum(date: TimerelAnyDate): number {
  if (typeof date === "number") return date;
  if (date instanceof Date) return date.getTime();
  return Date.parse(date);
}

/** Format a date to a relative time format */
export function timerel(date: TimerelAnyDate, {now, noAffix = false, times = defaultTimes, nowThreshold = 2000, nowString = "now", unknownString = "", aliases = false, aliasesMap = defaultAliasesMap, longUnits = false}: TimerelOpts = {}): string {
  let diff = (now === undefined ? Date.now() : toNum(now)) - toNum(date);
  if (Number.isNaN(diff)) return unknownString || String(date);

  const future = diff < 0;
  if (future) diff = -diff;
  if (diff < nowThreshold) return nowString;

  let num = 0;
  let suffix = "";
  for (let index = 0, len = times.length; index < len; index++) {
    const time = times[index];
    if (diff >= time[1]) continue;
    num = Math.trunc(diff / time[0]);
    suffix = (longUnits ? longUnitsMap[time[2]] || time[2] : time[2]) + (num > 1 ? "s" : "");
    break;
  }

  const base = `${num} ${suffix}`;
  const result = noAffix ? base : future ? `in ${base}` : `${base} ago`;
  return aliases ? (aliasesMap[result] ?? result) : result;
}
