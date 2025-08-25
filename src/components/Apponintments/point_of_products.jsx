import React, { useState } from 'react';

export default function PointOfProducts() {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');

  return (
    <div className="mt-6 border rounded-md">
      <div className="px-4 py-2 border-b text-sm font-medium text-gray-800">Product</div>
      <div className="p-4 space-y-4">
        <div>
          <div className="text-sm text-gray-700 mb-1">Product</div>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <div className="text-sm text-gray-700 mb-1">Quantity</div>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <div className="text-sm text-gray-700 mb-1">Price</div>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}


