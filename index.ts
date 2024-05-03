type Times = Array<[number, number, string]>

const defaultTimes: Times = [
  [1e3, 6e4, "sec"],
  [6e4, 36e5, "min"],
  [36e5, 864e5, "hour"],
  [864e5, 6048e5, "day"],
  [6048e5, 2628e6, "week"],
  [2628e6, 31536e6, "month"],
  [31536e6, Infinity, "year"],
];

type AliasesMap = {
  [key: string]: string,
}

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

type UnitsMap = {
  [key: string]: string,
}

const longUnitsMap: UnitsMap = {
  sec: "second",
  min: "minute",
};

type TimeRelOpts = {
  now?: Date | string | number,
  noAffix?: boolean,
  times?: Times,
  nowThreshold?: number,
  nowString?: string,
  aliases?: boolean,
  aliasesMap?: AliasesMap,
  longUnits?: boolean,
}

function toNum(date: Date | string | number): number {
  if (date instanceof Date) {
    return date.getTime();
  } else if (typeof date === "string") {
    return Date.parse(date);
  }
  return date;
}

export function timerel(date: Date | string | number, {now, noAffix = false, times = defaultTimes, nowThreshold = 2000, nowString = "now", aliases = false, aliasesMap = defaultAliasesMap, longUnits = false}: TimeRelOpts = {}) {
  date = toNum(date);
  now = now !== undefined ? toNum(now) : Date.now();
  if (Number.isNaN(date)) return "unknown";

  let future = false;
  let diff = now - date;

  if (diff < 0) {
    future = true;
    diff = Math.abs(diff);
  }
  if (diff < nowThreshold) return nowString;

  let num, suffix;
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
