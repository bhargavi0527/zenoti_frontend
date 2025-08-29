import React, { useEffect, useMemo, useState } from 'react';

export default function GiftCardsTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState([]);
  const [purchased, setPurchased] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!guestId) return;
      setLoading(true);
      const headers = { accept: 'application/json' };
      const safeFetch = async (url) => {
        try {
          const res = await fetch(url, { headers });
          if (!res.ok) throw new Error('http');
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch (_) {
          return [];
        }
      };
      const recv = await safeFetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/gift-cards/received/`)
        || await safeFetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/gift-cards/?type=received`);
      const purch = await safeFetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/gift-cards/purchased/`)
        || await safeFetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/gift-cards/?type=purchased`);
      setReceived(recv || []);
      setPurchased(purch || []);
      setLoading(false);
    };
    fetchAll();
  }, [guestId]);

  const toDate = (d) => { try { return new Date(d); } catch { return null; } };

  // Received table
  const recvHeaders = ['Invoice No','Receipt No','Code','Name','Occasion','Gifted By','Purchase Date','Activation Date','Expiration Date'];
  const recvCsv = useMemo(() => {
    const lines = [recvHeaders.join(',')];
    (received || []).forEach((g) => {
      const row = [
        g.invoice_no || '', g.receipt_no || '', g.code || '', g.name || '', g.occasion || '', g.gifted_by || '',
        g.purchase_date ? toDate(g.purchase_date)?.toLocaleDateString() : '',
        g.activation_date ? toDate(g.activation_date)?.toLocaleDateString() : '',
        g.expiration_date ? toDate(g.expiration_date)?.toLocaleDateString() : ''
      ];
      lines.push(row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  }, [received]);

  const downloadCsv = (csv, filename) => {
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

  const printTable = (headers, items, mapRow, title) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const body = (items || []).map((g) => `<tr>${mapRow(g).map((v)=>`<td style=\"padding:6px;border-bottom:1px solid #ddd;font-size:12px;\">${v}</td>`).join('')}</tr>`).join('');
    win.document.write(`<!doctype html><html><head><title>${title}</title></head><body>`);
    win.document.write(`<h3>${title}</h3>`);
    win.document.write(`<table style=\"width:100%;border-collapse:collapse;\">`);
    win.document.write(`<thead><tr>${headers.map(h=>`<th style=\"text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;\">${h}</th>`).join('')}</tr></thead>`);
    win.document.write(`<tbody>${body || `<tr><td colspan=\"${headers.length}\">No data</td></tr>`}</tbody>`);
    win.document.write(`</table></body></html>`);
    win.document.close(); win.focus(); win.print();
  };

  // Purchased table
  const purchHeaders = ['Invoice No','Receipt No','Code','Name','Sale/Refund Date','Activation Date','Expiration Date','Price','Card'];
  const purchCsv = useMemo(() => {
    const lines = [purchHeaders.join(',')];
    (purchased || []).forEach((g) => {
      const row = [
        g.invoice_no || '', g.receipt_no || '', g.code || '', g.name || '',
        g.sale_refund_date ? toDate(g.sale_refund_date)?.toLocaleDateString() : '',
        g.activation_date ? toDate(g.activation_date)?.toLocaleDateString() : '',
        g.expiration_date ? toDate(g.expiration_date)?.toLocaleDateString() : '',
        Number(g.price || 0), g.card || ''
      ];
      lines.push(row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    return lines.join('\n');
  }, [purchased]);

  return (
    <div className="p-1 space-y-8">
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2">Received History</div>
        <div className="flex items-center justify-end gap-2 mb-2">
          <button className="p-1.5 border rounded" title="Print" onClick={()=>printTable(recvHeaders, received, (g)=>[
            g.invoice_no || '', g.receipt_no || '', g.code || '', g.name || '', g.occasion || '', g.gifted_by || '',
            g.purchase_date ? toDate(g.purchase_date)?.toLocaleDateString() : '',
            g.activation_date ? toDate(g.activation_date)?.toLocaleDateString() : '',
            g.expiration_date ? toDate(g.expiration_date)?.toLocaleDateString() : ''
          ], 'Received Gift Cards')}>🖨</button>
          <button className="p-1.5 border rounded" title="Export CSV" onClick={()=>downloadCsv(recvCsv, 'giftcards_received.csv')}>⤓</button>
        </div>
        <div className="w-full overflow-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                {recvHeaders.map(h => (<th key={h} className="px-2 py-2">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-2 py-3 text-gray-500" colSpan={recvHeaders.length}>Loading…</td></tr>
              ) : (received || []).length === 0 ? (
                <tr><td className="px-2 py-3 text-gray-500" colSpan={recvHeaders.length}>No gift cards to show</td></tr>
              ) : (
                received.map((g, idx) => (
                  <tr key={g.id || idx} className="border-b last:border-b-0">
                    <td className="px-2 py-2">{g.invoice_no || ''}</td>
                    <td className="px-2 py-2">{g.receipt_no || ''}</td>
                    <td className="px-2 py-2">{g.code || ''}</td>
                    <td className="px-2 py-2">{g.name || ''}</td>
                    <td className="px-2 py-2">{g.occasion || ''}</td>
                    <td className="px-2 py-2">{g.gifted_by || ''}</td>
                    <td className="px-2 py-2">{g.purchase_date ? toDate(g.purchase_date).toLocaleDateString() : ''}</td>
                    <td className="px-2 py-2">{g.activation_date ? toDate(g.activation_date).toLocaleDateString() : ''}</td>
                    <td className="px-2 py-2">{g.expiration_date ? toDate(g.expiration_date).toLocaleDateString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-900 mb-2">Purchased History</div>
        <div className="flex items-center justify-end gap-2 mb-2">
          <button className="p-1.5 border rounded" title="Print" onClick={()=>printTable(purchHeaders, purchased, (g)=>[
            g.invoice_no || '', g.receipt_no || '', g.code || '', g.name || '',
            g.sale_refund_date ? toDate(g.sale_refund_date)?.toLocaleDateString() : '',
            g.activation_date ? toDate(g.activation_date)?.toLocaleDateString() : '',
            g.expiration_date ? toDate(g.expiration_date)?.toLocaleDateString() : '',
            Number(g.price || 0), g.card || ''
          ], 'Purchased Gift Cards')}>🖨</button>
          <button className="p-1.5 border rounded" title="Export CSV" onClick={()=>downloadCsv(purchCsv, 'giftcards_purchased.csv')}>⤓</button>
        </div>
        <div className="w-full overflow-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                {purchHeaders.map(h => (<th key={h} className="px-2 py-2">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-2 py-3 text-gray-500" colSpan={purchHeaders.length}>Loading…</td></tr>
              ) : (purchased || []).length === 0 ? (
                <tr><td className="px-2 py-3 text-gray-500" colSpan={purchHeaders.length}>No gift cards to show</td></tr>
              ) : (
                purchased.map((g, idx) => (
                  <tr key={g.id || idx} className="border-b last:border-b-0">
                    <td className="px-2 py-2">{g.invoice_no || ''}</td>
                    <td className="px-2 py-2">{g.receipt_no || ''}</td>
                    <td className="px-2 py-2">{g.code || ''}</td>
                    <td className="px-2 py-2">{g.name || ''}</td>
                    <td className="px-2 py-2">{g.sale_refund_date ? toDate(g.sale_refund_date).toLocaleDateString() : ''}</td>
                    <td className="px-2 py-2">{g.activation_date ? toDate(g.activation_date).toLocaleDateString() : ''}</td>
                    <td className="px-2 py-2">{g.expiration_date ? toDate(g.expiration_date).toLocaleDateString() : ''}</td>
                    <td className="px-2 py-2">{Number(g.price || 0).toLocaleString()}</td>
                    <td className="px-2 py-2">{g.card || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


