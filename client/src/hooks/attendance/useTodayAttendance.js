import { useState, useEffect, useCallback } from 'react';
import { mockDelay, getInterns, getTodayRecord, getStats } from './mockAttendance'; // MOCK

// const BASE = '/api/v1'; // REAL, assumed: relative base path

export function useTodayAttendance({ search, page, limit }) {
  const [interns, setInterns] = useState([]);
  const [stats, setStats] = useState({ total: 0, here: 0, away: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // MOCK: reads the fake data, no network
  const fetchInterns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await mockDelay();
      const { data, meta } = getInterns({ search, page, limit });
      setInterns(
        data.map((i) => {
          const rec = getTodayRecord(i.id);
          return {
            id: i.id,
            name: i.fullName,
            email: i.email,
            project: i.techArea, // assumed: techArea fills the "project" column
            status: rec && !rec.signOutAt ? 'here' : 'away', // assumed: here = signed in and not yet signed out
            signedInAt: rec ? rec.signInAt : null,
          };
        })
      );
      const summary = getStats();
      setStats({
        total: summary.activeInterns,
        here: summary.currentlyPresent,
        away: summary.activeInterns - summary.currentlyPresent, // assumed: away = active minus currently present
      });
      setTotalPages(meta.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [search, page, limit]);

  // REAL: uncomment this and delete the MOCK version above when the backend works
  // const fetchInterns = useCallback(async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const today = new Date().toISOString().slice(0, 10); // assumed: UTC date counts as "today"
  //     const opts = { credentials: 'include' };
  //
  //     const internParams = new URLSearchParams({
  //       status: 'ACTIVE', // assumed: only active interns are listed
  //       page: String(page),
  //       limit: String(limit),
  //     });
  //     if (search) internParams.set('search', search);
  //
  //     const [internsRes, summaryRes] = await Promise.all([
  //       fetch(`${BASE}/interns?${internParams}`, opts),
  //       fetch(`${BASE}/dashboard/summary`, opts),
  //     ]);
  //     if (!internsRes.ok || !summaryRes.ok) throw new Error('Could not load attendance');
  //     const internsJson = await internsRes.json();
  //     const summaryJson = await summaryRes.json();
  //
  //     const records = await Promise.all(
  //       internsJson.data.map(async (i) => {
  //         const res = await fetch(
  //           `${BASE}/attendance?internId=${i.id}&startDate=${today}&endDate=${today}&limit=1`,
  //           opts
  //         );
  //         if (!res.ok) throw new Error('Could not load attendance');
  //         const json = await res.json();
  //         return json.data[0] || null;
  //       })
  //     );
  //
  //     setInterns(
  //       internsJson.data.map((i, idx) => {
  //         const rec = records[idx];
  //         return {
  //           id: i.id,
  //           name: i.fullName,
  //           email: i.email,
  //           project: i.techArea, // assumed: techArea fills the "project" column
  //           status: rec && !rec.signOutAt ? 'here' : 'away', // assumed: here = signed in and not yet signed out
  //           signedInAt: rec ? rec.signInAt : null,
  //         };
  //       })
  //     );
  //     setStats({
  //       total: summaryJson.data.activeInterns,
  //       here: summaryJson.data.currentlyPresent,
  //       away: summaryJson.data.activeInterns - summaryJson.data.currentlyPresent, // assumed
  //     });
  //     setTotalPages(internsJson.meta.totalPages);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [search, page, limit]);

  useEffect(() => {
    fetchInterns();
  }, [fetchInterns]);

  return { interns, stats, totalPages, isLoading, error, refetch: fetchInterns };
}