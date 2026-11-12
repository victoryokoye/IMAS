import { useState, useEffect } from 'react';
import { mockDelay, getRecord, updateRecord, deleteRecord } from './mockAttendance'; // MOCK

// const RECORD_URL = '/api/v1/attendance'; // REAL, assumed: relative base path

export function useAttendanceRecord(id) {
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    // MOCK: reads the fake data, no network
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        await mockDelay();
        setRecord(getRecord(id));
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
    //     const res = await fetch(`${RECORD_URL}/${id}`, { credentials: 'include' });
    //     if (!res.ok) throw new Error('Could not load this record');
    //     const json = await res.json();
    //     setRecord(json.data);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }

    load();
  }, [id]);

  // MOCK: edits or deletes the fake record
  async function send(method, body) {
    setIsSaving(true);
    setActionError(null);
    try {
      await mockDelay();
      if (method === 'PUT') updateRecord(id, body);
      else deleteRecord(id);
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  // REAL: uncomment this and delete the MOCK version above when the backend works
  // async function send(method, body) {
  //   setIsSaving(true);
  //   setActionError(null);
  //   try {
  //     const res = await fetch(`${RECORD_URL}/${id}`, {
  //       method,
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: body ? JSON.stringify(body) : undefined,
  //     });
  //     if (!res.ok) {
  //       const data = await res.json().catch(() => ({}));
  //       throw new Error(data.message || 'Something went wrong');
  //     }
  //     return true;
  //   } catch (err) {
  //     setActionError(err.message);
  //     return false;
  //   } finally {
  //     setIsSaving(false);
  //   }
  // }

  return {
    record,
    isLoading,
    isSaving,
    error,
    actionError,
    update: (fields) => send('PUT', fields),
    remove: () => send('DELETE'),
  };
}