import React from 'react';

export default function Master() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Master</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Services</h2>
            <p className="text-sm text-gray-600">Create and manage services offered.</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Products</h2>
            <p className="text-sm text-gray-600">Manage inventory and product details.</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Providers</h2>
            <p className="text-sm text-gray-600">Add and update provider profiles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

