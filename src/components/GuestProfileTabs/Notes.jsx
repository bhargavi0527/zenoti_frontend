import React, { useEffect, useMemo, useState } from 'react';

export default function NotesTab({ guestId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);

  // New note form
  const [noteText, setNoteText] = useState('');
  const [showOnHistory, setShowOnHistory] = useState(false);
  const [showOnCheckIn, setShowOnCheckIn] = useState(false);
  const [showOnBooking, setShowOnBooking] = useState(false);
  const [showOnPayment, setShowOnPayment] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredNotes = useMemo(() => {
    switch (filter) {
      case 'history': return notes.filter(n => n.show_on_history);
      case 'checkin': return notes.filter(n => n.show_on_checkin);
      case 'booking': return notes.filter(n => n.show_on_booking);
      case 'payment': return notes.filter(n => n.show_on_payment);
      default: return notes;
    }
  }, [notes, filter]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/notes/`, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setNotes(data);
      } catch (e) {
        // Graceful: keep empty and no hard error UI
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [guestId]);

  const onAdd = async () => {
    const payload = {
      text: noteText.trim(),
      show_on_history: showOnHistory,
      show_on_checkin: showOnCheckIn,
      show_on_booking: showOnBooking,
      show_on_payment: showOnPayment,
    };
    if (!payload.text) return;

    // Optimistic add
    const optimistic = {
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      added_by: 'You',
      center: '',
      note_type: 'General',
      ...payload,
    };
    setNotes((prev) => [optimistic, ...prev]);
    setNoteText('');
    setShowOnHistory(false);
    setShowOnCheckIn(false);
    setShowOnBooking(false);
    setShowOnPayment(false);

    // Try POST to backend; ignore failures
    try {
      if (!guestId) return;
      const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}/notes/`, {
        method: 'POST',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setNotes((prev) => prev.map(n => n.id === optimistic.id ? saved : n));
      }
    } catch (_) {}
  };

  return (
    <div className="p-1">
      <div className="mb-3">
        <div className="text-sm text-gray-700 mb-1">Add A Note For This Guest</div>
        <textarea
          className="w-full h-28 border rounded px-2 py-1 text-sm"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <div className="mt-3 space-y-2 text-sm text-gray-800">
          <label className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" checked={showOnHistory} onChange={(e)=>setShowOnHistory(e.target.checked)} />Show on opening Guest History</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" checked={showOnCheckIn} onChange={(e)=>setShowOnCheckIn(e.target.checked)} />Show during check-in</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" checked={showOnBooking} onChange={(e)=>setShowOnBooking(e.target.checked)} />Show when booking Appointment</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" checked={showOnPayment} onChange={(e)=>setShowOnPayment(e.target.checked)} />Show when taking payment</label>
        </div>
        <div className="mt-3">
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm" onClick={onAdd}>Add</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-900">Notes</div>
        <select className="text-sm border rounded px-2 py-1 bg-white" value={filter} onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All Notes</option>
          <option value="history">History</option>
          <option value="checkin">Check-in</option>
          <option value="booking">Booking</option>
          <option value="payment">Payment</option>
        </select>
      </div>

      <div className="w-full overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="px-2 py-2">Date Created</th>
              <th className="px-2 py-2">Note</th>
              <th className="px-2 py-2">Note Type</th>
              <th className="px-2 py-2">Added By</th>
              <th className="px-2 py-2">Center</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={5}>Loading…</td></tr>
            ) : filteredNotes.length === 0 ? (
              <tr><td className="px-2 py-3 text-gray-500" colSpan={5}>No data available</td></tr>
            ) : (
              filteredNotes.map((n) => (
                <tr key={n.id} className="border-b last:border-b-0">
                  <td className="px-2 py-2 text-gray-700">{new Date(n.created_at || Date.now()).toLocaleString()}</td>
                  <td className="px-2 py-2 text-gray-900 whitespace-pre-wrap">{n.text || n.note || ''}</td>
                  <td className="px-2 py-2 text-gray-700">{n.note_type || 'General'}</td>
                  <td className="px-2 py-2 text-gray-700">{n.added_by || ''}</td>
                  <td className="px-2 py-2 text-gray-700">{n.center || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


