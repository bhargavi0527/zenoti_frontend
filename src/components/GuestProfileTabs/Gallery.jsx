import React from 'react';

export default function GalleryTab() {
  return (
    <div className="p-2">
      <div className="text-sm text-gray-700 mb-2">Gallery will show before/after photos and documents.</div>
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-span-6 md:col-span-3 h-32 bg-gray-100 border rounded" />
        ))}
      </div>
    </div>
  );
}


