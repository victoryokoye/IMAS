import { useState, useEffect } from 'react';

export function useAttendanceHistory({ from, to, internId }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: '100' }); // assumed: limit 100 is allowed
        if (from) params.set('startDate', from);
        if (to) params.set('endDate', to);
        const res = await fetch(`/api/v1/interns/${internId}/attendance?${params}`, { // assumed: relative base path
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Could not load attendance history');
        const json = await res.json();
        setRecords(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [from, to, internId]);

  return { records, isLoading, error };
}