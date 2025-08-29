import React from 'react';

export function Tabs({ tabs = [], activeKey, onChange = () => {} }) {
  return (
    <div>
      <div className="flex border-b mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px ${activeKey === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-700 hover:text-blue-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((t) => t.key === activeKey)?.content || null}</div>
    </div>
  );
}


