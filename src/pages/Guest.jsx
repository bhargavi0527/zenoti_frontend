import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestTable from '../components/Guest/Guest.jsx';
import Sidebar from '../components/Layouts/sidebar';

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <GuestTable />
      </div>
    </div>
  );
}


