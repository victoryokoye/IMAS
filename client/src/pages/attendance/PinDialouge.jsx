import { useState } from 'react';
import { useAttendanceAction } from '../../hooks/attendance/useAttendanceAction';

export default function PinDialog({ intern, action, onClose, onDone }) {
  const [pin, setPin] = useState('');
  const [success, setSuccess] = useState(false);
  const { submit, isLoading, error } = useAttendanceAction();
  const label = action === 'sign-in' ? 'Sign in' : 'Sign out';

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await submit({ internId: intern.id, action, pin });
    if (ok) setSuccess(true);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div role="dialog" aria-modal="true" className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        {success ? (
          <>
            <p role="status" className="text-green-700 font-semibold mb-4">
              {label} successful for {intern.name}.
            </p>
            <button
              onClick={onDone}
              className="w-full rounded-lg bg-orange-600 text-white font-semibold py-3"
            >
              Done
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {label}: {intern.name}
            </h2>
            <p className="text-sm text-slate-500 mb-4">Enter the intern's PIN.</p>

            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              autoFocus
              required
              className="w-full rounded-lg bg-blue-50 px-3 py-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

            {error && (
              <p role="alert" className="text-sm text-red-600 mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg bg-blue-50 text-slate-800 font-semibold py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-orange-600 text-white font-semibold py-3 disabled:opacity-60"
              >
                {isLoading ? 'Submitting...' : label}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}