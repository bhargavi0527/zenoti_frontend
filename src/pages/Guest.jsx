import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestTable from '../components/Guest/Guest.jsx';

export default function GuestLanding() {
  const [guestId, setGuestId] = useState('');
  const navigate = useNavigate();

  const openProfile = (e) => {
    e.preventDefault();
    const id = guestId.trim();
    if (!id) return;
    navigate(`/guests/${encodeURIComponent(id)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Open Guest Profile</h1>
        <form onSubmit={openProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Guest Code / ID</label>
            <input
              value={guestId}
              onChange={(e)=>setGuestId(e.target.value)}
              placeholder="Enter guest code (e.g., COTR1520)"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Open Profile</button>
            <button type="button" className="px-3 py-2 border rounded" onClick={()=>setGuestId('')}>Clear</button>
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4">Tip: You can also navigate to Guest Profile directly via /guests/&lt;guestId&gt;.</p>
      </div>
      <GuestTable />
    </div>
  );
}


