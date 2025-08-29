import React, { useEffect, useMemo, useState } from 'react';

export default function IssuesTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const headers = ['Creation Date','Issue','Description','Notes','Status','Priority','Center'];

  useEffect(() => {
    const fetchIssues = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/issues/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (_) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [guestId]);

  const toDate = (d) => { try { return new Date(d); } catch { return null; } };

  const csv = useMemo(() => {
    const lines = [headers.join(',')];
    rows.forEach((r) => {
      const row = [
        r.creation_date ? toDate(r.creation_date)?.toLocaleDateString() : '',
        r.issue || r.title || '',
        r.description || '',
        r.notes || '',
        r.status || '',
        r.priority || '',
        r.center || r.center_name || ''
      ];
      lines.push(row.map((v)=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  }, [rows]);

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'issues.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const printItems = () => {
    const win = window.open('', '_blank'); if (!win) return;
    const body = rows.map((r) => {
      const cols = [r.creation_date ? toDate(r.creation_date)?.toLocaleDateString() : '', r.issue || r.title || '', r.description || '', r.notes || '', r.status || '', r.priority || '', r.center || r.center_name || ''];
      return `<tr>${cols.map((c)=>`<td style=\"padding:6px;border-bottom:1px solid #ddd;font-size:12px;\">${c}</td>`).join('')}</tr>`;
    }).join('');
    win.document.write(`<!doctype html><html><head><title>Issues</title></head><body>`);
    win.document.write(`<h3>Issues</h3>`);
    win.document.write(`<table style=\"width:100%;border-collapse:collapse;\"><thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead><tbody>${body || '<tr><td colspan=\"7\">No data</td></tr>'}</tbody></table>`);
    win.document.write(`</body></html>`); win.document.close(); win.focus(); win.print();
  };

  return (
    <div className="p-1">
      <div className="flex items-center justify-end gap-2 mb-2">
        <button className="p-1.5 border rounded" title="Print" onClick={printItems}>🖨</button>
        <button className="p-1.5 border rounded" title="Export CSV" onClick={downloadCsv}>⤓</button>
      </div>
      <div className="w-full overflow-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              {headers.map((h) => (<th key={h} className="px-2 py-2">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>No data available</td></tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id || idx} className="border-b last:border-b-0">
                  <td className="px-2 py-2">{r.creation_date ? toDate(r.creation_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{r.issue || r.title || ''}</td>
                  <td className="px-2 py-2">{r.description || ''}</td>
                  <td className="px-2 py-2">{r.notes || ''}</td>
                  <td className="px-2 py-2">{r.status || ''}</td>
                  <td className="px-2 py-2">{r.priority || ''}</td>
                  <td className="px-2 py-2">{r.center || r.center_name || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


