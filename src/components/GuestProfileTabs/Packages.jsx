import React, { useEffect, useMemo, useState } from 'react';

export default function PackagesTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('all'); // all | active | expired | refunded

  useEffect(() => {
    const fetchPackages = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/packages/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (_) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [guestId]);

  const toDate = (d) => { try { return new Date(d); } catch { return null; } };
  const headers = ['Invoice No','Receipt No','Package Name','Refund','Price','Sale/Refund Date','Start Date','Expiration Date','Expiration With Grace','OTP Required','Sale Center','Code'];

  const filtered = useMemo(() => {
    if (status === 'all') return rows;
    if (status === 'active') return rows.filter(p => !p.refund && (!p.expiration_date || toDate(p.expiration_date) >= new Date()));
    if (status === 'expired') return rows.filter(p => p.expiration_date && toDate(p.expiration_date) < new Date());
    if (status === 'refunded') return rows.filter(p => Boolean(p.refund));
    return rows;
  }, [rows, status]);

  const toCsv = (items) => {
    const lines = [headers.join(',')];
    items.forEach((p) => {
      const srd = p.sale_refund_date ? toDate(p.sale_refund_date)?.toLocaleDateString() : '';
      const sd = p.start_date ? toDate(p.start_date)?.toLocaleDateString() : '';
      const ed = p.expiration_date ? toDate(p.expiration_date)?.toLocaleDateString() : '';
      const ewg = p.expiration_with_grace ? toDate(p.expiration_with_grace)?.toLocaleDateString() : '';
      const row = [
        p.invoice_no || '',
        p.receipt_no || '',
        p.package_name || p.name || '',
        p.refund ? 'Yes' : 'No',
        Number(p.price || 0),
        srd,
        sd,
        ed,
        ewg,
        p.otp_required ? 'Yes' : 'No',
        p.sale_center || p.center_name || '',
        p.code || ''
      ];
      lines.push(row.map((v)=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  };

  const downloadCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packages.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const printItems = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const body = filtered.map((p) => {
      const srd = p.sale_refund_date ? toDate(p.sale_refund_date)?.toLocaleDateString() : '';
      const sd = p.start_date ? toDate(p.start_date)?.toLocaleDateString() : '';
      const ed = p.expiration_date ? toDate(p.expiration_date)?.toLocaleDateString() : '';
      const ewg = p.expiration_with_grace ? toDate(p.expiration_with_grace)?.toLocaleDateString() : '';
      const cols = [p.invoice_no || '', p.receipt_no || '', p.package_name || p.name || '', p.refund ? 'Yes' : 'No', Number(p.price || 0), srd, sd, ed, ewg, p.otp_required ? 'Yes' : 'No', p.sale_center || p.center_name || '', p.code || ''];
      return `<tr>${cols.map((c)=>`<td style=\"padding:6px;border-bottom:1px solid #ddd;font-size:12px;\">${c}</td>`).join('')}</tr>`;
    }).join('');
    win.document.write(`<!doctype html><html><head><title>Packages</title></head><body>`);
    win.document.write(`<h3>Packages</h3>`);
    win.document.write(`<table style=\"width:100%;border-collapse:collapse;\"><thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead><tbody>${body || '<tr><td colspan=\"12\">No data</td></tr>'}</tbody></table>`);
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="p-1">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-700 flex items-center gap-2">
          <span>View Package with status:</span>
          <select className="text-xs border rounded px-2 py-1 bg-white" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="refunded">Refunded</option>
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border rounded" title="Print" onClick={printItems}>🖨</button>
          <button className="p-1.5 border rounded" title="Export CSV" onClick={downloadCsv}>⤓</button>
        </div>
      </div>
      <div className="w-full overflow-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              {headers.map(h => (<th key={h} className="px-2 py-2">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>No data available</td></tr>
            ) : (
              filtered.map((p, idx) => (
                <tr key={p.id || idx} className="border-b last:border-b-0">
                  <td className="px-2 py-2">{p.invoice_no || ''}</td>
                  <td className="px-2 py-2">{p.receipt_no || ''}</td>
                  <td className="px-2 py-2">{p.package_name || p.name || ''}</td>
                  <td className="px-2 py-2">{p.refund ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-2">{Number(p.price || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{p.sale_refund_date ? toDate(p.sale_refund_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{p.start_date ? toDate(p.start_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{p.expiration_date ? toDate(p.expiration_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{p.expiration_with_grace ? toDate(p.expiration_with_grace).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{p.otp_required ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-2">{p.sale_center || p.center_name || ''}</td>
                  <td className="px-2 py-2">{p.code || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


