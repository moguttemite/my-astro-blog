// /workout/ 页面的日期计算：一律按东京时间（Asia/Tokyo）判断「今天」是计划里的哪一天。
// 只用 YYYY-MM-DD 字符串和 UTC 毫秒做加减，避免设备时区、夏令时带来的偏差。

export type DayKind = 'A' | 'B' | 'walk' | 'recovery' | 'long' | 'baseline' | 'before';

export interface DayInfo {
  ymd: string;
  /** 0 = 周日 … 6 = 周六 */
  dow: number;
  /** 0 = 基线周；1–12 = 正式周；≥13 = 周期结束后 */
  week: number;
  kind: DayKind;
  afterEnd: boolean;
}

const DAY_MS = 86_400_000;
const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

/** 星期 → 当天类型（口诀：一 A、二走、三 B、四走、五恢复、六 A、日长走＋回顾） */
const DOW_KIND: DayKind[] = ['long', 'A', 'walk', 'B', 'walk', 'recovery', 'A'];

export const WEEKDAY_CN = ['日', '一', '二', '三', '四', '五', '六'];

export function isYmd(s: string | null | undefined): s is string {
  if (!s) return false;
  const m = YMD.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

export function ymdToUtc(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function utcToYmd(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(ymd: string, n: number): string {
  return utcToYmd(ymdToUtc(ymd) + n * DAY_MS);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((ymdToUtc(to) - ymdToUtc(from)) / DAY_MS);
}

/** 东京时间的今天 */
export function tokyoToday(now: Date = new Date()): string {
  // en-CA 的日期格式就是 YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function dayInfo(
  ymd: string,
  plan: { baselineStart: string; start: string; totalWeeks: number },
): DayInfo {
  const dow = new Date(ymdToUtc(ymd)).getUTCDay();
  const sinceStart = daysBetween(plan.start, ymd);

  if (sinceStart >= 0) {
    const week = Math.floor(sinceStart / 7) + 1;
    return { ymd, dow, week, kind: DOW_KIND[dow], afterEnd: week > plan.totalWeeks };
  }
  if (daysBetween(plan.baselineStart, ymd) >= 0) {
    return { ymd, dow, week: 0, kind: 'baseline', afterEnd: false };
  }
  return { ymd, dow, week: -1, kind: 'before', afterEnd: false };
}

/** 该日期所在那一周的周一到周日 */
export function weekDates(ymd: string): string[] {
  const dow = new Date(ymdToUtc(ymd)).getUTCDay();
  const monday = addDays(ymd, -((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** 「10月21日 周三」 */
export function formatCnDate(ymd: string): string {
  const [, m, d] = ymd.split('-').map(Number);
  const dow = new Date(ymdToUtc(ymd)).getUTCDay();
  return `${m}月${d}日 周${WEEKDAY_CN[dow]}`;
}
