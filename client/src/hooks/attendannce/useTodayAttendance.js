import { useState, useEffect, useCallback } from 'react';

const INTERNS_URL = '/api/v1/interns'; // assumed: relative base path
const ATTENDANCE_URL = '/api/v1/attendance'; // assumed: relative base path

export function useTodayAttendance() {
  const [interns, setInterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10); // assumed: UTC date counts as "today"
      const opts = { credentials: 'include' };
      const [internsRes, attendanceRes] = await Promise.all([
        fetch(`${INTERNS_URL}?status=ACTIVE&limit=100`, opts), // assumed: limit 100 is allowed
        fetch(`${ATTENDANCE_URL}?startDate=${today}&endDate=${today}&limit=100`, opts), // assumed: limit 100 is allowed
      ]);
      if (!internsRes.ok || !attendanceRes.ok) throw new Error('Could not load attendance');
      const internsJson = await internsRes.json();
      const attendanceJson = await attendanceRes.json();

      const byIntern = new Map(attendanceJson.data.map((r) => [r.internId, r]));
      setInterns(
        internsJson.data.map((i) => {
          const rec = byIntern.get(i.id);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterns();
  }, [fetchInterns]);

  return { interns, isLoading, error, refetch: fetchInterns };
}