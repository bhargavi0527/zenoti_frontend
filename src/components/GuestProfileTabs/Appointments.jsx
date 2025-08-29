import React, { useEffect, useMemo, useState } from 'react';

export default function AppointmentsTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('open'); // 'open' | 'all'

  useEffect(() => {
    const fetchGuestAppointments = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/appointments/`, {
          headers: { accept: 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (_) {
        // fallback: keep empty; UI still renders
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGuestAppointments();
  }, [guestId]);

  const now = new Date();
  const toDate = (d) => {
    try { return new Date(d); } catch { return new Date(0); }
  };
  const filtered = useMemo(() => {
    if (statusFilter === 'open') return rows.filter(r => String(r.status || '').toLowerCase() === 'open');
    return rows;
  }, [rows, statusFilter]);
  const upcoming = useMemo(() => filtered.filter(r => toDate(r.scheduled_time) >= now), [filtered]);
  const past = useMemo(() => filtered.filter(r => toDate(r.scheduled_time) < now), [filtered]);

  const headers = [
    'Action','Invoice No','Receipt No','Service','Service Date','Status','Choose Your Doctor','Payment Type','Price','Qty','Cost','Discount','Redemptions','Taxes','Center','Promotion','Reason'
  ];

  const toCsv = (items) => {
    const lines = [];
    lines.push(headers.join(','));
    items.forEach((a) => {
      const dt = toDate(a.scheduled_time);
      const date = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
      const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const row = [
        'Edit',
        a.invoice_no || '',
        a.receipt_no || '0',
        a.service_name || a.service || '',
        `${date} ${time}`,
        (a.status || 'OPEN').toString().toUpperCase(),
        a.doctor_name || a.provider || '',
        a.payment_type || '',
        Number(a.price || 0),
        a.qty || 1,
        Number(a.cost || a.price || 0),
        Number(a.discount || 0),
        Number(a.redemptions || 0),
        Number(a.taxes || 0),
        a.center_name || '',
        a.promotion || '',
        a.reason || ''
      ];
      // escape commas/quotes
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
    const rowsHtml = items.map((a) => {
      const dt = toDate(a.scheduled_time);
      const date = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
      const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const tds = [
        'Edit', a.invoice_no || '', a.receipt_no || '0', a.service_name || a.service || '', `${date} ${time}`,
        (a.status || 'OPEN').toString().toUpperCase(), a.doctor_name || a.provider || '', a.payment_type || '',
        Number(a.price || 0), a.qty || 1, Number(a.cost || a.price || 0), Number(a.discount || 0), Number(a.redemptions || 0), Number(a.taxes || 0), a.center_name || '', a.promotion || '', a.reason || ''
      ];
      return `<tr>${tds.map((c)=>`<td style="padding:6px;border-bottom:1px solid #ddd;font-size:12px;">${c}</td>`).join('')}</tr>`;
    }).join('');
    win.document.write(`<!doctype html><html><head><title>${title}</title></head><body>`);
    win.document.write(`<h3>${title}</h3>`);
    win.document.write(`<table style="width:100%;border-collapse:collapse;">`);
    win.document.write(`<thead><tr>${headers.map(h=>`<th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;font-size:12px;">${h}</th>`).join('')}</tr></thead>`);
    win.document.write(`<tbody>${rowsHtml || '<tr><td colspan="17">No data</td></tr>'}</tbody>`);
    win.document.write(`</table></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const renderTable = (items, emptyText, sectionTitle) => (
    <div className="w-full overflow-auto">
      <div className="flex items-center justify-end gap-2 mb-2">
        <select className="text-xs border rounded px-2 py-1 bg-white" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="open">Open</option>
          <option value="all">All</option>
        </select>
        <button className="p-1.5 border rounded" title="Print" onClick={()=>printItems(items, sectionTitle)}>
          🖨
        </button>
        <button className="p-1.5 border rounded" title="Export CSV" onClick={()=>downloadCsv(items, `${sectionTitle.replace(/\s+/g,'_').toLowerCase()}.csv`)}>
          ⤓
        </button>
      </div>
      <table className="min-w-full text-xs">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="px-2 py-2">Action</th>
            <th className="px-2 py-2">Invoice No</th>
            <th className="px-2 py-2">Receipt No</th>
            <th className="px-2 py-2">Service</th>
            <th className="px-2 py-2">Service Date</th>
            <th className="px-2 py-2">Status</th>
            <th className="px-2 py-2">Choose Your Doctor</th>
            <th className="px-2 py-2">Payment Type</th>
            <th className="px-2 py-2">Price</th>
            <th className="px-2 py-2">Qty</th>
            <th className="px-2 py-2">Cost</th>
            <th className="px-2 py-2">Discount</th>
            <th className="px-2 py-2">Redemptions</th>
            <th className="px-2 py-2">Taxes</th>
            <th className="px-2 py-2">Center</th>
            <th className="px-2 py-2">Promotion</th>
            <th className="px-2 py-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-2 py-3 text-gray-500" colSpan={17}>Loading…</td></tr>
          ) : items.length === 0 ? (
            <tr><td className="px-2 py-3 text-gray-500" colSpan={17}>{emptyText}</td></tr>
          ) : (
            items.map((a) => (
              <tr key={a.id} className="border-b last:border-b-0">
                <td className="px-2 py-2 text-blue-600">Edit</td>
                <td className="px-2 py-2 text-blue-700 underline cursor-pointer">{a.invoice_no || ''}</td>
                <td className="px-2 py-2">{a.receipt_no || '0'}</td>
                <td className="px-2 py-2">{a.service_name || a.service || ''}</td>
                <td className="px-2 py-2">
                  {(() => {
                    const dt = toDate(a.scheduled_time);
                    const date = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
                    const time = `${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    return (
                      <div>
                        <div>{date}</div>
                        <div className="text-gray-600">{time}</div>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-2 py-2">{(a.status || 'OPEN').toUpperCase()}</td>
                <td className="px-2 py-2">{a.doctor_name || a.provider || ''}</td>
                <td className="px-2 py-2">{a.payment_type || ''}</td>
                <td className="px-2 py-2">{Number(a.price || 0).toLocaleString()}</td>
                <td className="px-2 py-2">{a.qty || 1}</td>
                <td className="px-2 py-2">{Number(a.cost || a.price || 0).toLocaleString()}</td>
                <td className="px-2 py-2">{Number(a.discount || 0).toLocaleString()}</td>
                <td className="px-2 py-2">{Number(a.redemptions || 0).toLocaleString()}</td>
                <td className="px-2 py-2">{Number(a.taxes || 0).toLocaleString()}</td>
                <td className="px-2 py-2">{a.center_name || ''}</td>
                <td className="px-2 py-2">{a.promotion || ''}</td>
                <td className="px-2 py-2">{a.reason || ''}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-1 space-y-6">
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2">Upcoming Appointments</div>
        {renderTable(upcoming, 'No upcoming appointments', 'upcoming_appointments')}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2">Past Appointments</div>
        {renderTable(past, 'No past appointments', 'past_appointments')}
      </div>
    </div>
  );
}


