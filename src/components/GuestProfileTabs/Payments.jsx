import React, { useEffect, useState } from 'react';

export default function PaymentsTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const headers = ['Date', 'Mode', 'Amount', 'Invoice No', 'Center', 'Notes'];

  useEffect(() => {
    const fetchData = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/payments/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error('http');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (_) { setRows([]); } finally { setLoading(false); }
    };
    fetchData();
  }, [guestId]);

  const toDate = (d) => { try { return new Date(d).toLocaleDateString(); } catch { return ''; } };

  return (
    <div className="p-1">
      <div className="w-full overflow-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-600 border-b">{headers.map(h => (<th key={h} className="px-2 py-2">{h}</th>))}</tr>
          </thead>
          <tbody>
            {loading ? (<tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>Loading…</td></tr>) : rows.length === 0 ? (<tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>No data available</td></tr>) : rows.map((r, i) => (
              <tr key={r.id || i} className="border-b last:border-b-0">
                <td className="px-2 py-2">{toDate(r.date)}</td>
                <td className="px-2 py-2">{r.mode || ''}</td>
                <td className="px-2 py-2">{Number(r.amount || 0).toLocaleString()}</td>
                <td className="px-2 py-2">{r.invoice_no || ''}</td>
                <td className="px-2 py-2">{r.center || r.center_name || ''}</td>
                <td className="px-2 py-2">{r.notes || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


