import type { ReactNode } from "react";
import { toAppError } from "../../utils/errors";
import { btnSecondary } from "./ui";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-600" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      {label}
    </div>
  );
}

export function ErrorAlert({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const e = toAppError(error);
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p className="font-medium">{e.message}</p>
      {e.isNetwork && (
        <p className="mt-1 text-red-700">
          If the server was idle it can take up to a minute to start. Retrying usually works.
        </p>
      )}
      {onRetry && (
        <button type="button" onClick={onRetry} className={`${btnSecondary} mt-3`}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
