const STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-slate-200 text-slate-700",
  OPEN: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ABANDONED: "bg-amber-100 text-amber-800",
  CANCELED: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STYLES[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}
