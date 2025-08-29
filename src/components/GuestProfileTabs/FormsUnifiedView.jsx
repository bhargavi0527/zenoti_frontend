import React from 'react';

export default function FormsUnifiedViewTab() {
  return (
    <div className="p-2 text-sm text-gray-700">
      <div className="mb-2">Forms unified view is not yet connected to the backend. Below is a placeholder layout:</div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 border rounded p-3 bg-white">Consent Forms</div>
        <div className="col-span-12 md:col-span-6 border rounded p-3 bg-white">Assessments</div>
        <div className="col-span-12 border rounded p-3 bg-white">Other Forms</div>
      </div>
    </div>
  );
}


