import { useState, useEffect } from 'react';
import { mockDelay, getInternRecords } from './mockAttendance'; // MOCK

export function useAttendanceHistory({ from, to, internId, page, limit }) {
  const [records, setRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // MOCK: reads the fake data, no network
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        await mockDelay();
        const { data, meta } = getInternRecords(internId, { from, to, page, limit });
        setRecords(data);
        setTotalPages(meta.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    // REAL: uncomment this and delete the MOCK version above when the backend works
    // async function load() {
    //   setIsLoading(true);
    //   setError(null);
    //   try {
    //     const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    //     if (from) params.set('startDate', from);
    //     if (to) params.set('endDate', to);
    //     const res = await fetch(`/api/v1/interns/${internId}/attendance?${params}`, { // assumed: relative base path
    //       credentials: 'include',
    //     });
    //     if (!res.ok) throw new Error('Could not load attendance history');
    //     const json = await res.json();
    //     setRecords(json.data);
    //     setTotalPages(json.meta.totalPages);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }

    load();
  }, [from, to, internId, page, limit]);

  return { records, totalPages, isLoading, error };
}