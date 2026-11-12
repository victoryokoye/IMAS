import { useState, useEffect } from 'react';
import { mockDelay, getInterns, countInternRecords, countAllRecords } from './mockAttendance'; // MOCK

// const BASE = '/api/v1'; // REAL, assumed: relative base path

export function useAttendanceSummary({ from, to, search, page, limit }) {
  const [rows, setRows] = useState([]);
  const [totalCameIn, setTotalCameIn] = useState(0);
  const [totalInterns, setTotalInterns] = useState(0);
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
        const { data, meta } = getInterns({ search, page, limit });
        setRows(
          data.map((i) => ({
            id: i.id,
            name: i.fullName,
            cameIn: countInternRecords(i.id, { from, to }),
          }))
        );
        setTotalCameIn(countAllRecords({ from, to }));
        setTotalInterns(meta.total);
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
    //     const opts = { credentials: 'include' };
    //
    //     const range = new URLSearchParams({ limit: '1' });
    //     if (from) range.set('startDate', from);
    //     if (to) range.set('endDate', to);
    //
    //     const internParams = new URLSearchParams({
    //       status: 'ACTIVE', // assumed: only active interns are listed
    //       page: String(page),
    //       limit: String(limit),
    //     });
    //     if (search) internParams.set('search', search);
    //
    //     const [internsRes, totalRes] = await Promise.all([
    //       fetch(`${BASE}/interns?${internParams}`, opts),
    //       fetch(`${BASE}/attendance?${range}`, opts),
    //     ]);
    //     if (!internsRes.ok || !totalRes.ok) throw new Error('Could not load attendance history');
    //     const internsJson = await internsRes.json();
    //     const totalJson = await totalRes.json();
    //
    //     const counts = await Promise.all(
    //       internsJson.data.map(async (i) => {
    //         const res = await fetch(`${BASE}/interns/${i.id}/attendance?${range}`, opts);
    //         if (!res.ok) throw new Error('Could not load attendance history');
    //         const json = await res.json();
    //         return json.meta.total;
    //       })
    //     );
    //
    //     setRows(
    //       internsJson.data.map((i, idx) => ({
    //         id: i.id,
    //         name: i.fullName,
    //         cameIn: counts[idx],
    //       }))
    //     );
    //     setTotalCameIn(totalJson.meta.total);
    //     setTotalInterns(internsJson.meta.total);
    //     setTotalPages(internsJson.meta.totalPages);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }

    load();
  }, [from, to, search, page, limit]);

  return { rows, totalCameIn, totalInterns, totalPages, isLoading, error };
}