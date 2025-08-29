import React, { useEffect, useMemo, useState } from 'react';

export default function ProductsTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all'); // all | refund | sale

  useEffect(() => {
    const fetchProducts = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/products/`, {
          headers: { accept: 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (_) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [guestId]);

  const filtered = useMemo(() => {
    if (filter === 'all') return rows;
    if (filter === 'refund') return rows.filter(r => Boolean(r.refund));
    if (filter === 'sale') return rows.filter(r => !r.refund);
    return rows;
  }, [rows, filter]);

  const headers = ['Invoice No','Receipt No','Product','Color/Label/Size','Refund','Sale/Refund Date','Sold By','Promotion','Qty','Cost','Discount','Taxes','Price','Payment Type'];

  const toDate = (d) => { try { return new Date(d); } catch { return new Date(0); } };

  const toCsv = (items) => {
    const lines = [];
    lines.push(headers.join(','));
    items.forEach((p) => {
      const dt = p.sale_refund_date ? toDate(p.sale_refund_date) : null;
      const dateStr = dt ? dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) : '';
      const row = [
        p.invoice_no || '',
        p.receipt_no || '',
        p.product_name || p.product || '',
        p.variant || p.label || p.size || '',
        p.refund ? 'Yes' : 'No',
        dateStr,
        p.sold_by || '',
        p.promotion || '',
        p.qty || 1,
        Number(p.cost || 0),
        Number(p.discount || 0),
        Number(p.taxes || 0),
        Number(p.price || 0),
        p.payment_type || ''
      ];
      lines.push(row.map((v)=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  };

  const downloadCsv = (items, filename) => {
    const csv = toCsv(items);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const printItems = (items, title) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rowsHtml = items.map((p) => {
      const dt = p.sale_refund_date ? toDate(p.sale_refund_date) : null;
      const dateStr = dt ? dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) : '';
      const tds = [
        p.invoice_no || '', p.receipt_no || '', p.product_name || p.product || '', p.variant || p.label || p.size || '', p.refund ? 'Yes' : 'No',
        dateStr, p.sold_by || '', p.promotion || '', p.qty || 1, Number(p.cost || 0), Number(p.discount || 0), Number(p.taxes || 0), Number(p.price || 0), p.payment_type || ''
      ];
      return `<tr>${tds.map((c)=>`<td style="padding:6px;border-bottom:1px solid #ddd;font-size:12px;">${c}</td>`).join('')}</tr>`;
    }).join('');
    win.document.write(`<!doctype html><html><head><title>${title}</title></head><body>`);
    win.document.write(`<h3>${title}</h3>`);
    win.document.write(`<table style="width:100%;border-collapse:collapse;">`);
    win.document.write(`<thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead>`);
    win.document.write(`<tbody>${rowsHtml || '<tr><td colspan=\"14\">No data</td></tr>'}</tbody>`);
    win.document.write(`</table></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="p-1">
      <div className="flex items-center justify-end gap-2 mb-2">
        <select className="text-xs border rounded px-2 py-1 bg-white" value={filter} onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="sale">Sale</option>
          <option value="refund">Refund</option>
        </select>
        <button className="p-1.5 border rounded" title="Print" onClick={()=>printItems(filtered, 'products')}>
          🖨
        </button>
        <button className="p-1.5 border rounded" title="Export CSV" onClick={()=>downloadCsv(filtered, 'products.csv')}>
          ⤓
        </button>
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
            ) : filtered.length === 0 ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={headers.length}>No data available</td></tr>
            ) : (
              filtered.map((p, idx) => (
                <tr key={p.id || idx} className="border-b last:border-b-0">
                  <td className="px-2 py-2">{p.invoice_no || ''}</td>
                  <td className="px-2 py-2">{p.receipt_no || ''}</td>
                  <td className="px-2 py-2">{p.product_name || p.product || ''}</td>
                  <td className="px-2 py-2">{p.variant || p.label || p.size || ''}</td>
                  <td className="px-2 py-2">{p.refund ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-2">{p.sale_refund_date ? toDate(p.sale_refund_date).toLocaleDateString() : ''}</td>
                  <td className="px-2 py-2">{p.sold_by || ''}</td>
                  <td className="px-2 py-2">{p.promotion || ''}</td>
                  <td className="px-2 py-2">{p.qty || 1}</td>
                  <td className="px-2 py-2">{Number(p.cost || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{Number(p.discount || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{Number(p.taxes || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{Number(p.price || 0).toLocaleString()}</td>
                  <td className="px-2 py-2">{p.payment_type || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


