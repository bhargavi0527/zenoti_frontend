import React from 'react';

export default function OpenTab() {
  const items = [
    { label: 'Pending Payments', count: 0 },
    { label: 'Unresolved Issues', count: 0 },
    { label: 'Upcoming Appointments', count: 0 },
  ];
  return (
    <div className="p-2 text-sm text-gray-900">
      <div className="grid grid-cols-12 gap-4">
        {items.map((it, idx) => (
          <div key={idx} className="col-span-12 md:col-span-4 border rounded p-4 bg-white">
            <div className="text-gray-500">{it.label}</div>
            <div className="text-2xl font-semibold">{it.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


