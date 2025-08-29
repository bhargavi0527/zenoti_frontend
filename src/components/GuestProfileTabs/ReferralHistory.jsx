import React, { useEffect, useMemo, useState } from 'react';

export default function ReferralHistoryTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/referrals/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (_) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [guestId]);

  const headers = ['Referred Guest','Redemption Date','Award Type','Award Status','Award Name','Award Issue Date','Invoice No','Referred Date','Base Center'];
  const toDate = (d) => { try { return new Date(d); } catch { return null; } };

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const toCsv = (items) => {
    const lines = [headers.join(',')];
    items.forEach((r) => {
      const rd = r.redemption_date ? toDate(r.redemption_date)?.toLocaleDateString() : '';
      const ad = r.award_issue_date ? toDate(r.award_issue_date)?.toLocaleDateString() : '';
      const refd = r.referred_date ? toDate(r.referred_date)?.toLocaleDateString() : '';
      const row = [
        r.referred_guest || r.guest_name || '',
        rd,
        r.award_type || '',
        r.award_status || '',
        r.award_name || '',
        ad,
        r.invoice_no || '',
        refd,
        r.base_center || r.center_name || ''
      ];
      lines.push(row.map((v)=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  };

  const downloadCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'referral_history.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const printItems = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const body = rows.map((r) => {
      const rd = r.redemption_date ? toDate(r.redemption_date)?.toLocaleDateString() : '';
      const ad = r.award_issue_date ? toDate(r.award_issue_date)?.toLocaleDateString() : '';
      const refd = r.referred_date ? toDate(r.referred_date)?.toLocaleDateString() : '';
      const cols = [r.referred_guest || r.guest_name || '', rd, r.award_type || '', r.award_status || '', r.award_name || '', ad, r.invoice_no || '', refd, r.base_center || r.center_name || ''];
      return `<tr>${cols.map((c)=>`<td style=\"padding:6px;border-bottom:1px solid #ddd;font-size:12px;\">${c}</td>`).join('')}</tr>`;
    }).join('');
    win.document.write(`<!doctype html><html><head><title>Referral History</title></head><body>`);
    win.document.write(`<h3>Referrals</h3>`);
    win.document.write(`<table style=\"width:100%;border-collapse:collapse;\"><thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead><tbody>${body || '<tr><td colspan=\"9\">No data</td></tr>'}</tbody></table>`);
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

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
              {headers.map(h => (<th key={h} className="px-2 py-2">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>Loading…</td></tr>
            ) : paged.length === 0 ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>No data available</td></tr>
            ) : (
              paged.map((r, idx) => (
                <tr key={r.id || idx} className="border-b last:border-b-0">
                  <td className="px-2 py-2">{r.referred_guest || r.guest_name || ''}</td>
                  <td className="px-2 py-2">{r.redemption_date ? toDate(r.redemption_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{r.award_type || ''}</td>
                  <td className="px-2 py-2">{r.award_status || ''}</td>
                  <td className="px-2 py-2">{r.award_name || ''}</td>
                  <td className="px-2 py-2">{r.award_issue_date ? toDate(r.award_issue_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{r.invoice_no || ''}</td>
                  <td className="px-2 py-2">{r.referred_date ? toDate(r.referred_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{r.base_center || r.center_name || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-3 mt-2 text-xs text-gray-700">
        <button className="px-2 py-1 border rounded disabled:opacity-50" disabled={page <= 1} onClick={()=>setPage((p)=>Math.max(1, p-1))}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button className="px-2 py-1 border rounded disabled:opacity-50" disabled={page >= totalPages} onClick={()=>setPage((p)=>Math.min(totalPages, p+1))}>Next</button>
      </div>
    </div>
  );
}


