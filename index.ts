export type TimerelAnyDate = string | number | Date;
export type TimeUnit = Intl.RelativeTimeFormatUnitSingular;
export type TimesArray = Array<[maxMs: number, unit: TimeUnit]>;

const units: Record<TimeUnit, [ms: number, label: string, shortLabel: string, longLabel: string, id: number]> = {
  second: [1e3, "sec", "s", "second", 0],
  minute: [6e4, "min", "m", "minute", 1],
  hour: [36e5, "hour", "h", "hour", 2],
  day: [864e5, "day", "d", "day", 3],
  week: [6048e5, "week", "w", "week", 4],
  month: [2628e6, "month", "mo", "month", 5],
  quarter: [7884e6, "quarter", "q", "quarter", 6],
  year: [31536e6, "year", "y", "year", 7],
};

const defaultTimes: TimesArray = [
  [6e4, "second"],
  [36e5, "minute"],
  [864e5, "hour"],
  [6048e5, "day"],
  [2628e6, "week"],
  [31536e6, "month"],
  [Infinity, "year"],
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
  /** A custom time table of `[maxMs, unit]` entries, ascending by `maxMs`. */
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
  /** Locale, formatted via `Intl` unless `"en"`. Default: `"en"`. */
  locale?: Intl.LocalesArgument,
  /** Custom formatter receiving the count, negative for past dates, and the unit. Overrides all other formatting options except `nowString` and `unknownString`. */
  format?: (num: number, unit: TimeUnit) => string,
};

type IntlOpts = Required<Pick<TimerelOpts, "locale" | "noAffix" | "aliases">> & {style: Intl.RelativeTimeFormatStyle};

const formatters = new Map<string, Intl.RelativeTimeFormat | Intl.NumberFormat>();
const resultsByOpts = new Map<string, Map<number, string>>();
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

function formatIntl(num: number, unit: TimeUnit | undefined, future: boolean, opts: IntlOpts): string {
  const {locale, noAffix, aliases, style} = opts;
  if (last?.locale !== locale || last.noAffix !== noAffix || last.aliases !== aliases || last.style !== style) {
    const optsKey = `${String(locale)}|${noAffix}|${aliases}|${style}`;
    if (!resultsByOpts.has(optsKey)) resultsByOpts.set(optsKey, new Map());
    last = {...opts, results: resultsByOpts.get(optsKey)!};
  }

  const key = unit ? (num * 8 + units[unit][4]) * 2 + Number(future) : NaN;
  let result = last.results.get(key);
  if (result === undefined) {
    const numeric = !unit || aliases ? "auto" : "always";
    result = noAffix && unit ?
      getFormatter(`${String(locale)}|${style}|${unit}`, () => new Intl.NumberFormat(locale, {style: "unit", unit, unitDisplay: style})).format(num) :
      getFormatter(`${String(locale)}|${style}|${numeric}`, () => new Intl.RelativeTimeFormat(locale, {style, numeric})).format(future ? num : -num, unit ?? "second");
    if (last.results.size >= 1000) last.results.clear(); // bounds custom tables with unbounded counts
    last.results.set(key, result);
  }
  return result;
}

/** Format a date to a relative time format */
export function timerel(date: TimerelAnyDate, {now, noAffix = false, times = defaultTimes, nowThreshold = 2000, nowString, unknownString, aliases = false, aliasesMap = defaultAliasesMap, longUnits = false, shortUnits = false, locale = "en", format}: TimerelOpts = {}): string {
  let diff = (now === undefined ? Date.now() : toNum(now)) - toNum(date);
  if (Number.isNaN(diff)) return unknownString || String(date);

  const future = diff < 0;
  if (future) diff = -diff;
  const intlOpts: IntlOpts | undefined = locale === "en" ? undefined : {locale, noAffix, aliases, style: shortUnits ? "narrow" : longUnits ? "long" : "short"};
  if (diff < nowThreshold) return nowString ?? (intlOpts ? formatIntl(0, undefined, future, intlOpts) : "now");

  let base = "";
  for (let index = 0, len = times.length; index < len; index++) {
    if (diff >= times[index][0]) continue;
    const unit = times[index][1];
    const [ms, label, shortLabel, longLabel] = units[unit];
    const num = Math.trunc(diff / ms);
    if (format) return format(future ? num : -num, unit);
    if (intlOpts) return formatIntl(num, unit, future, intlOpts);
    base = shortUnits ? `${num}${shortLabel}` : `${num} ${longUnits ? longLabel : label}${num === 1 ? "" : "s"}`;
    break;
  }

  const result = noAffix ? base : future ? `in ${base}` : `${base} ago`;
  return aliases ? (aliasesMap[result] ?? result) : result;
}
