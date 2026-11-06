import { useEffect, type ReactNode } from "react";
import { btnDanger, btnPrimary, btnSecondary } from "./ui";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  destructive,
  loading,
  error,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  loading?: boolean;
  error?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-700">{message}</p>
      {error && <div className="mt-4">{error}</div>}
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className={btnSecondary} onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button
          type="button"
          className={destructive ? btnDanger : btnPrimary}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
