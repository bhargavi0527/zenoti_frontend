import React, { useEffect, useMemo, useState } from 'react';

export default function PrepaidCardsTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('all'); // all | active | expired | refunded

  useEffect(() => {
    const fetchCards = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/prepaid-cards/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (_) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [guestId]);

  const toDate = (d) => { try { return new Date(d); } catch { return null; } };
  const headers = ['Invoice No','Receipt No','Code','Refund','Sale/Refund Date','Expiration Date','Price','Card Value','Balance','Sale Center','Status','Refunded','Notes'];

  const filtered = useMemo(() => {
    if (status === 'all') return rows;
    if (status === 'active') return rows.filter(c => !c.refund && (!c.expiration_date || toDate(c.expiration_date) >= new Date()));
    if (status === 'expired') return rows.filter(c => c.expiration_date && toDate(c.expiration_date) < new Date());
    if (status === 'refunded') return rows.filter(c => Boolean(c.refund || c.refunded));
    return rows;
  }, [rows, status]);

  const toCsv = (items) => {
    const lines = [headers.join(',')];
    items.forEach((c) => {
      const srd = c.sale_refund_date ? toDate(c.sale_refund_date)?.toLocaleDateString() : '';
      const ed = c.expiration_date ? toDate(c.expiration_date)?.toLocaleDateString() : '';
      const row = [
        c.invoice_no || '', c.receipt_no || '', c.code || '', c.refund ? 'Yes' : 'No', srd, ed,
        Number(c.price || 0), Number(c.card_value || 0), Number(c.balance || 0),
        c.sale_center || c.center_name || '', c.status || '', c.refunded ? 'Yes' : 'No', c.notes || ''
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
    a.download = 'prepaid_cards.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const printItems = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const body = filtered.map((c) => {
      const srd = c.sale_refund_date ? toDate(c.sale_refund_date)?.toLocaleDateString() : '';
      const ed = c.expiration_date ? toDate(c.expiration_date)?.toLocaleDateString() : '';
      const cols = [c.invoice_no || '', c.receipt_no || '', c.code || '', c.refund ? 'Yes' : 'No', srd, ed, Number(c.price || 0), Number(c.card_value || 0), Number(c.balance || 0), c.sale_center || c.center_name || '', c.status || '', c.refunded ? 'Yes' : 'No', c.notes || ''];
      return `<tr>${cols.map((v)=>`<td style=\"padding:6px;border-bottom:1px solid #ddd;font-size:12px;\">${v}</td>`).join('')}</tr>`;
    }).join('');
    win.document.write(`<!doctype html><html><head><title>Prepaid Cards</title></head><body>`);
    win.document.write(`<h3>Prepaid Cards</h3>`);
    win.document.write(`<table style=\"width:100%;border-collapse:collapse;\"><thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead><tbody>${body || '<tr><td colspan=\"13\">No data</td></tr>'}</tbody></table>`);
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="p-1">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-700 flex items-center gap-2">
          <span>Filter:</span>
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
              filtered.map((c, idx) => (
                <tr key={c.id || idx} className="border-b last:border-b-0">
                  <td className="px-2 py-2">{c.invoice_no || ''}</td>
                  <td className="px-2 py-2">{c.receipt_no || ''}</td>
                  <td className="px-2 py-2">{c.code || ''}</td>
                  <td className="px-2 py-2">{c.refund ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-2">{c.sale_refund_date ? toDate(c.sale_refund_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{c.expiration_date ? toDate(c.expiration_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{Number(c.price || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{Number(c.card_value || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{Number(c.balance || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{c.sale_center || c.center_name || ''}</td>
                  <td className="px-2 py-2">{c.status || ''}</td>
                  <td className="px-2 py-2">{c.refunded ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-2">{c.notes || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


