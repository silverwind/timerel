const times = [
  [1000, 60000, "sec"],
  [60000, 3600000, "min"],
  [3600000, 86400000, "hour"],
  [86400000, 604800000, "day"],
  [604800000, 2628000000, "week"],
  [2628000000, 31536000000, "month"],
  [31536000000, Infinity, "year"],
];

export function timerel(date, {noAffix = false} = {}) {
  date = typeof date === "number" ? date : Date.parse(date);
  if (Number.isNaN(date)) return "unknown";

  const ref = Date.now();
  let future = false;
  let diff = ref - date;

  if (diff < 0) {
    future = true;
    diff = Math.abs(diff);
  }
  if (diff < 10000) return "now";

  let num, suffix;
  for (let i = 0, len = times.length; i < len; i++) {
    const time = times[i];
    if (diff >= time[1]) continue;
    num = Math.floor(diff / time[0]);
    suffix = time[2];
    if (num > 1) suffix += "s";
    break;
  }

  return `${future && !noAffix ? "in " : ""}${num} ${suffix}${!future && !noAffix ? " ago" : ""}`;
}
