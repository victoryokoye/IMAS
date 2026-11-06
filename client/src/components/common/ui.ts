// Shared Tailwind class strings (keeps buttons/inputs consistent without a UI library)
export const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";
export const btnPrimary = `${btnBase} bg-slate-900 text-white hover:bg-slate-700`;
export const btnSecondary = `${btnBase} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`;
export const btnDanger = `${btnBase} bg-red-600 text-white hover:bg-red-700`;

export const inputClass = (hasError?: boolean) =>
  `w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 ${
    hasError ? "border-red-500" : "border-slate-300"
  }`;
