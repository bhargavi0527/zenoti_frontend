import React from 'react';

export default function OpportunitiesTab() {
  const opps = [
    { title: 'Membership Upsell', status: 'Open' },
    { title: 'Package Renewal', status: 'Open' },
  ];
  return (
    <div className="p-2 text-sm text-gray-900">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="px-2 py-2">Opportunity</th>
            <th className="px-2 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {opps.map((o, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <td className="px-2 py-2">{o.title}</td>
              <td className="px-2 py-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


