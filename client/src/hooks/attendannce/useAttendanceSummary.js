import { useState, useEffect } from 'react';

const SUMMARY_URL = '/api/attendance/summary'; // replace with your real endpoint

export function useAttendanceSummary({ from, to }) {
  const [summary, setSummary] = useState({ totalCameIn: 0, totalMissed: 0, interns: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        const res = await fetch(`${SUMMARY_URL}?${params}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Could not load attendance history');
        setSummary(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [from, to]);

  return { summary, isLoading, error };
}