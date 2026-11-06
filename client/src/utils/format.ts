export function formatDate(value?: string | null): string {
  if (!value) return "—";
  // "YYYY-MM-DD" is parsed as local time to avoid off-by-one-day shifts
  const d =
    value.length === 10
      ? new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)))
      : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function toDateInput(value?: string | null): string {
  return value ? value.slice(0, 10) : "";
}
