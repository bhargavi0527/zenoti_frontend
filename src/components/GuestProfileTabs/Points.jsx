import React, { useEffect, useMemo, useState } from 'react';

export default function PointsTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const headers = ['Invoice No','Receipt No','Earned On','Program','Points Earned','Points Redeemed','Balance','Redemption Start','Redemption End','Center'];

  useEffect(() => {
    const fetchData = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/points/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error('http');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (_) { setRows([]); } finally { setLoading(false); }
    };
    fetchData();
  }, [guestId]);

  const toDate = (d) => { try { return new Date(d).toLocaleDateString(); } catch { return ''; } };

  const balanceValue = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) return 0;
    const explicit = rows[rows.length - 1]?.balance;
    if (typeof explicit === 'number') return explicit;
    return rows.reduce((acc, r) => acc + Number(r.points_earned || r.points || 0) - Number(r.points_redeemed || 0), 0);
  }, [rows]);

  const csv = useMemo(() => {
    const lines = [headers.join(',')];
    rows.forEach((r) => {
      const row = [
        r.invoice_no || '',
        r.receipt_no || '',
        toDate(r.earned_on || r.date),
        r.program || r.type || '',
        r.points_earned || r.points || 0,
        r.points_redeemed || 0,
        r.balance || balanceValue,
        toDate(r.redemption_start),
        toDate(r.redemption_end),
        r.center || r.center_name || ''
      ];
      lines.push(row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  }, [rows, balanceValue]);

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'points.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const printItems = () => {
    const win = window.open('', '_blank'); if (!win) return;
    const body = rows.map(r => `<tr>${[r.invoice_no || '', r.receipt_no || '', toDate(r.earned_on || r.date), r.program || r.type || '', r.points_earned || r.points || 0, r.points_redeemed || 0, (r.balance ?? balanceValue), toDate(r.redemption_start), toDate(r.redemption_end), r.center || r.center_name || ''].map(c=>`<td style=\"padding:6px;border-bottom:1px solid #ddd;font-size:12px;\">${c}</td>`).join('')}</tr>`).join('');
    win.document.write(`<!doctype html><html><head><title>Points</title></head><body><h3>Points</h3><table style=\"width:100%;border-collapse:collapse;\"><thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead><tbody>${body || '<tr><td colspan=\"10\">No data</td></tr>'}</tbody></table></body></html>`);
    win.document.close(); win.focus(); win.print();
  };

  return (
    <div className="p-1">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-800">Balance <span className="font-medium">{Number(balanceValue).toFixed(2)}</span> <span className="text-gray-500">[ ₹ {Number(balanceValue).toFixed(2)} ]</span></div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Enroll</button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Spent Amount</button>
          <button className="p-1.5 border rounded" onClick={printItems} title="Print">🖨</button>
          <button className="p-1.5 border rounded" onClick={downloadCsv} title="Export CSV">⤓</button>
        </div>
      </div>
      <div className="w-full overflow-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-600 border-b">{headers.map(h => (<th key={h} className="px-2 py-2">{h}</th>))}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>No data available</td></tr>
            ) : rows.map((r, i) => (
              <tr key={r.id || i} className="border-b last:border-b-0">
                <td className="px-2 py-2">{r.invoice_no || ''}</td>
                <td className="px-2 py-2">{r.receipt_no || ''}</td>
                <td className="px-2 py-2">{toDate(r.earned_on || r.date)}</td>
                <td className="px-2 py-2">{r.program || r.type || ''}</td>
                <td className="px-2 py-2">{r.points_earned || r.points || 0}</td>
                <td className="px-2 py-2">{r.points_redeemed || 0}</td>
                <td className="px-2 py-2">{r.balance ?? balanceValue}</td>
                <td className="px-2 py-2">{toDate(r.redemption_start)}</td>
                <td className="px-2 py-2">{toDate(r.redemption_end)}</td>
                <td className="px-2 py-2">{r.center || r.center_name || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


