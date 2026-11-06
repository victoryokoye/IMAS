import type { PaginationMeta } from "../../types/api";
import { btnSecondary } from "./ui";

export default function Pagination({
  meta,
  onPageChange,
  disabled,
}: {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <span>
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={disabled || meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={disabled || meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
