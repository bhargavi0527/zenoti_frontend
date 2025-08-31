import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const navigate = useNavigate();

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * pageSize;
      const res = await fetch(`http://127.0.0.1:8000/guests/?skip=${skip}&limit=${pageSize}`, {
        headers: { accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);

      // Lookahead to determine if next page exists
      try {
        const nextRes = await fetch(`http://127.0.0.1:8000/guests/?skip=${skip + pageSize}&limit=1`, {
          headers: { accept: 'application/json' }
        });
        if (!nextRes.ok) throw new Error('head check failed');
        const nextData = await nextRes.json();
        setHasNext(Array.isArray(nextData) && nextData.length > 0);
      } catch {
        // Fallback: infer from current page size
        setHasNext(Array.isArray(data) && data.length === pageSize);
      }
    } catch (e) {
      console.error('Failed to fetch guests', e);
      setError('Failed to fetch guests');
      setRows([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGuests(); }, [page]);

  const headers = useMemo(() => (
    ['Code', 'First Name', 'Last Name', 'Gender', 'DOB', 'Phone', 'Email', 'Center', 'Actions']
  ), []);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-700">Guests</div>
        <div className="flex items-center gap-1">
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p)=>Math.max(1, p-1))}
          >Prev</button>
          {/* Page numbers: previous, current, next */}
          {page > 2 && (
            <>
              <button className="px-2 py-1 text-sm border rounded" onClick={() => setPage(1)}>1</button>
              <span className="px-1 text-gray-500">…</span>
            </>
          )}
          {page > 1 && (
            <button className="px-2 py-1 text-sm border rounded" onClick={() => setPage(page-1)}>{page-1}</button>
          )}
          <button className="px-2 py-1 text-sm border rounded bg-blue-600 text-white">{page}</button>
          {hasNext && (
            <button className="px-2 py-1 text-sm border rounded" onClick={() => setPage(page+1)}>{page+1}</button>
          )}
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={!hasNext}
            onClick={() => setPage((p)=>p+1)}
          >Next</button>
        </div>
      </div>
      <div className="w-full overflow-auto border rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left text-gray-600 border-b">
              {headers.map(h => (<th key={h} className="px-3 py-2 font-medium">{h}</th>))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={headers.length}>Loading…</td></tr>
            ) : error ? (
              <tr><td className="px-3 py-6 text-center text-red-600" colSpan={headers.length}>{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={headers.length}>No guests found</td></tr>
            ) : (
              rows.map((g, idx) => (
                <tr key={g.id || idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{g.guest_code || ''}</td>
                  <td className="px-3 py-2">{g.first_name || ''}</td>
                  <td className="px-3 py-2">{g.last_name || ''}</td>
                  <td className="px-3 py-2">{g.gender || ''}</td>
                  <td className="px-3 py-2">{g.date_of_birth || ''}</td>
                  <td className="px-3 py-2">{g.phone_no || ''}</td>
                  <td className="px-3 py-2">{g.email || ''}</td>
                  <td className="px-3 py-2">{g.center_name || ''}</td>
                  <td className="px-3 py-2">
                    <button className="text-blue-600 hover:underline" onClick={()=>navigate(`/guests/${encodeURIComponent(g.guest_code || g.id)}`)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


