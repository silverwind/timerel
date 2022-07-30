export function timerel(date, {noAffix = false} = {}) {
  date = typeof date === "number" ? date : Date.parse(date);
  if (Number.isNaN(date)) return "unknown";

  const ref = Date.now();
  const diff = Math.abs(ref - date);
  if (diff < 10000) return "now";

  let num, suffix;
  for (const time of [
    [60000, 1000, "sec"],
    [3600000, 60000, "min"],
    [86400000, 3600000, "hour"],
    [604800000, 86400000, "day"],
    [2628000000, 604800000, "week"],
    [31536000000, 2628000000, "month"],
    [Infinity, 31536000000, "year"],
  ]) {
    if (diff >= time[0]) continue;
    num = Math.floor(diff / time[1]);
    suffix = `${time[2]}${num > 1 ? "s" : ""}`;
    break;
  }

  const future = date > ref;
  return `${future && !noAffix ? "in " : ""}${num} ${suffix}${!future && !noAffix ? " ago" : ""}`;
}
