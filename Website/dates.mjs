function berlinDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    weekday: weekdays[values.weekday],
  };
}

function formatDateParts({ year, month, day }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays({ year, month, day }, days) {
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}


function shortDate(value) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(localDate(value));
}

function weekdayShort(value) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short" })
    .format(localDate(value))
    .replace(/\.$/, "")
    .slice(0, 2);
}

function localDate(value) {
  return new Date(`${value}T12:00:00`);
}

function defaultDayIndex(days, date = new Date()) {
  const now = berlinDateParts(date);
  const today = formatDateParts(now);
  const defaultDate = now.hour >= 14 ? addDays(now, 1) : now;
  const defaultDateString = formatDateParts(defaultDate);
  const defaultIndex = days.findIndex((day) => day.date === defaultDateString);
  const todayIndex = days.findIndex((day) => day.date === today);
  const index = defaultIndex >= 0 ? defaultIndex : todayIndex >= 0 ? todayIndex : Math.min(now.weekday - 1, 4);
  return index < 0 ? 4 : index;
}

export { berlinDateParts, formatDateParts, shortDate, weekdayShort, localDate, defaultDayIndex };
