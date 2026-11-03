export type TimerelAnyDate = string | number | Date;
export type TimesArray = Array<[number, number, string, string?, string?]>;

const defaultTimes: TimesArray = [
  [1e3, 6e4, "sec", "s", "second"],
  [6e4, 36e5, "min", "m", "minute"],
  [36e5, 864e5, "hour", "h"],
  [864e5, 6048e5, "day", "d"],
  [6048e5, 2628e6, "week", "w"],
  [2628e6, 31536e6, "month", "mo"],
  [31536e6, Infinity, "year", "y"],
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

export type TimerelOpts = {
  /** The date to compare to. Default: `Date.now()`. */
  now?: TimerelAnyDate,
  /** Whether to omit `ago` and `in` affixes. Default: `false`. */
  noAffix?: boolean,
  /** A custom time table of `[msPerUnit, maxMs, unit, shortUnit?, longUnit?]` entries. */
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
  /** Use short units like `1d`, overriding `longUnits`. Default: `false`. */
  shortUnits?: boolean,
  /** Locale other than `"en"` formats via `Intl`, `times` entries then need a `longUnit` or `unit` valid for `Intl`. Default: `"en"`. */
  locale?: Intl.LocalesArgument,
};

type IntlOpts = Required<Pick<TimerelOpts, "times" | "locale" | "noAffix" | "aliases">> & {style: Intl.RelativeTimeFormatStyle};

const formatters = new Map<string, Intl.RelativeTimeFormat | Intl.NumberFormat>();
const resultsByTimes = new WeakMap<TimesArray, Map<string, Map<number, string>>>();
let last: IntlOpts & {results: Map<number, string>} | undefined; // skips the keyed lookup when options repeat

function getFormatter<T extends Intl.RelativeTimeFormat | Intl.NumberFormat>(key: string, create: () => T): T {
  if (!formatters.has(key)) formatters.set(key, create());
  return formatters.get(key) as T;
}

function toNum(date: TimerelAnyDate): number {
  if (typeof date === "number") return date;
  if (date instanceof Date) return date.getTime();
  return Date.parse(date);
}

function formatIntl(num: number, index: number, future: boolean, opts: IntlOpts): string {
  const {times, locale, noAffix, aliases, style} = opts;
  if (last?.times !== times || last.locale !== locale || last.noAffix !== noAffix || last.aliases !== aliases || last.style !== style) {
    if (!resultsByTimes.has(times)) resultsByTimes.set(times, new Map());
    const resultsByOpts = resultsByTimes.get(times)!;
    const optsKey = `${String(locale)}|${noAffix}|${aliases}|${style}`;
    if (!resultsByOpts.has(optsKey)) resultsByOpts.set(optsKey, new Map());
    last = {...opts, results: resultsByOpts.get(optsKey)!};
  }

  const key = index < 0 ? NaN : (num * times.length + index) * 2 + Number(future);
  let result = last.results.get(key);
  if (result === undefined) {
    const numeric = index < 0 || aliases ? "auto" : "always";
    const unit = index < 0 ? "second" : (times[index][4] || times[index][2]) as Intl.RelativeTimeFormatUnit;
    result = noAffix && index >= 0 ?
      getFormatter(`${String(locale)}|${style}|${unit}`, () => new Intl.NumberFormat(locale, {style: "unit", unit, unitDisplay: style})).format(num) :
      getFormatter(`${String(locale)}|${style}|${numeric}`, () => new Intl.RelativeTimeFormat(locale, {style, numeric})).format(future ? num : -num, unit);
    if (last.results.size >= 1000) last.results.clear(); // bounds custom tables with unbounded counts
    last.results.set(key, result);
  }
  return result;
}

/** Format a date to a relative time format */
export function timerel(date: TimerelAnyDate, {now, noAffix = false, times = defaultTimes, nowThreshold = 2000, nowString, unknownString, aliases = false, aliasesMap = defaultAliasesMap, longUnits = false, shortUnits = false, locale = "en"}: TimerelOpts = {}): string {
  let diff = (now === undefined ? Date.now() : toNum(now)) - toNum(date);
  if (Number.isNaN(diff)) return unknownString || String(date);

  const future = diff < 0;
  if (future) diff = -diff;
  const intlOpts: IntlOpts | undefined = locale === "en" ? undefined : {times, locale, noAffix, aliases, style: shortUnits ? "narrow" : longUnits ? "long" : "short"};
  if (diff < nowThreshold) return nowString ?? (intlOpts ? formatIntl(0, -1, future, intlOpts) : "now");

  let base = "";
  for (let index = 0, len = times.length; index < len; index++) {
    const time = times[index];
    if (diff >= time[1]) continue;
    const num = Math.trunc(diff / time[0]);
    if (intlOpts) return formatIntl(num, index, future, intlOpts);
    base = shortUnits ? `${num}${time[3] || time[2]}` : `${num} ${longUnits && time[4] || time[2]}${num === 1 ? "" : "s"}`;
    break;
  }

  const result = noAffix ? base : future ? `in ${base}` : `${base} ago`;
  return aliases ? (aliasesMap[result] ?? result) : result;
}
