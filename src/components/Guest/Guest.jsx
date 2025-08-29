import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`http://127.0.0.1:8000/guests/?skip=${page * pageSize}&limit=${pageSize}`, {
        headers: { accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch guests', e);
      setError('Failed to fetch guests');
      setRows([]);
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
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-700">Guests (page {page + 1})</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" disabled={page === 0} onClick={() => setPage((p)=>Math.max(0, p-1))}>Prev</button>
          <button className="px-3 py-1 border rounded" onClick={() => setPage((p)=>p+1)}>Next</button>
        </div>
      </div>
      <div className="w-full overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b bg-gray-50">
              {headers.map(h => (<th key={h} className="px-3 py-2">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3 text-gray-500" colSpan={headers.length}>Loading…</td></tr>
            ) : error ? (
              <tr><td className="px-3 py-3 text-red-600" colSpan={headers.length}>{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-3 py-3 text-gray-500" colSpan={headers.length}>No guests found</td></tr>
            ) : (
              rows.map((g) => (
                <tr key={g.id} className="border-b last:border-b-0">
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


