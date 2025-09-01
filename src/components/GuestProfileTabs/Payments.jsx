import React, { useEffect, useState } from 'react';
import PointOfSale from '../Apponintments/point_of_sale';

export default function PaymentsTab({ guestId, appointmentData }) {
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
      {/* Show Point of Sale if coming from appointment */}
      {appointmentData && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Process Payment for Appointment</h3>
            <div className="text-sm text-blue-800">
              <p><strong>Service:</strong> {appointmentData.services && appointmentData.services[0] ? appointmentData.services[0].serviceName : appointmentData.label}</p>
              <p><strong>Time:</strong> {appointmentData.startTime || 'N/A'} - {appointmentData.endTime || 'N/A'}</p>
              <p><strong>Resource:</strong> {appointmentData.resource}</p>
              {appointmentData.doctor && <p><strong>Doctor:</strong> {appointmentData.doctor}</p>}
            </div>
          </div>
          <PointOfSale />
        </div>
      )}
      
      {/* Payment History Table */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment History</h3>
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
    </div>
  );
}


