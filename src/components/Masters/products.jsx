import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../Layouts/sidebar';

export default function ProductsMaster() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [centers, setCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(true);
  const [centersError, setCentersError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState('');

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const [catDraft, setCatDraft] = useState(new Set());
  const [catQuery, setCatQuery] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Active');

  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://127.0.0.1:8000/products/', { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = Array.isArray(data) ? data.map((p, idx) => ({
          id: p.id ?? idx,
          code: p.code || p.sku || String(p.id || idx),
          name: p.name || 'Untitled',
          color: p.color || '-',
          size: p.size || '-',
          brand: p.brand || '-',
          category: p.category || '-',
          subcategory: p.subcategory || '-',
          businessUnit: p.business_unit || p.businessUnit || '-',
          type: p.type || p.product_type || '-',
          isActive: (typeof p.in_use === 'boolean' ? p.in_use : undefined) ?? (String(p.status || '').toLowerCase() === 'available'),
          statusText: p.status || ((p.in_use ?? true) ? 'Active' : 'Inactive'),
          salePrice: p.sale_price ?? p.price ?? 0,
          mrp: p.mrp ?? p.mrp_price ?? 0,
          amount: p.amount || p.package_size || '-',
          inUse: p.in_use ?? true,
        })) : [];
        setProducts(normalized);
      } catch (e) {
        console.error('Failed to load products', e);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadCenters = async () => {
      setCentersLoading(true);
      setCentersError(null);
      try {
        const res = await fetch('http://127.0.0.1:8000/centers/', { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = Array.isArray(data) ? data.map(c => ({ id: c.id, name: c.name })) : [];
        setCenters(normalized);
        if (!selectedCenter && normalized.length > 0) setSelectedCenter(normalized[0].name);
      } catch (e) {
        console.error('Failed to load centers', e);
        setCentersError('Failed to load centers');
        setCenters([]);
      } finally {
        setCentersLoading(false);
      }
    };
    loadCenters();
  }, []);

  const categoriesMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const cat = p.category || '-';
      const sub = p.subcategory || '-';
      if (!map.has(cat)) map.set(cat, new Set());
      map.get(cat).add(sub);
    });
    return map;
  }, [products]);

  const categoryItems = useMemo(() => {
    const query = catQuery.trim().toLowerCase();
    const items = Array.from(categoriesMap.entries()).map(([cat, subs]) => ({
      category: cat,
      subCount: subs.size,
      subs: Array.from(subs)
    }));
    if (!query) return items.sort((a,b)=>a.category.localeCompare(b.category));
    return items.filter((it) => {
      if (it.category.toLowerCase().includes(query)) return true;
      return it.subs.some((s) => String(s).toLowerCase().includes(query));
    }).sort((a,b)=>a.category.localeCompare(b.category));
  }, [categoriesMap, catQuery]);

  useEffect(() => {
    if (!catOpen) return;
    const onClick = (e) => {
      const el = document.getElementById('prod-cat-panel');
      const btn = document.getElementById('prod-cat-button');
      if (!el || !btn) return;
      if (!el.contains(e.target) && !btn.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [catOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = products;
    if (q) {
      rows = rows.filter((r) =>
        (r.code || '').toLowerCase().includes(q) ||
        (r.name || '').toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q) ||
        (r.subcategory || '').toLowerCase().includes(q) ||
        (r.brand || '').toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      const set = new Set(selectedCategories);
      rows = rows.filter((r) => set.has(r.category || '-'));
    }
    if (selectedBrand !== 'All') {
      rows = rows.filter((r) => (r.brand || '-') === selectedBrand);
    }
    if (selectedStatus !== 'All') {
      const wantActive = selectedStatus === 'Active';
      rows = rows.filter((r) => Boolean(r.isActive) === wantActive);
    }
    const dir = sort.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a,b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return rows;
  }, [products, search, selectedCategories, selectedBrand, selectedStatus, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const setSortKey = (key) => {
    setPage(1);
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

  const formatCurrencyINR = (val) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(val || 0));
    } catch {
      return val;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-0 flex">
        <Sidebar />
        <div className="flex-1 p-4 max-w-[1600px] mx-auto">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Manage products</h1>
            <div className="flex items-center gap-3">
              {centersLoading ? (
                <div className="h-9 px-3 rounded border bg-white text-sm flex items-center text-gray-600">Loading centers...</div>
              ) : centersError ? (
                <div className="h-9 px-3 rounded border bg-red-50 text-sm flex items-center text-red-700">Failed to load centers</div>
              ) : (
                <div className="relative">
                  <select
                    className="h-9 min-w-[260px] rounded border px-3 text-sm pr-8 appearance-none bg-white"
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">▾</span>
                </div>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 relative">
              {/* Categories dropdown */}
              <button
                id="prod-cat-button"
                type="button"
                onClick={() => { setCatOpen((v)=>!v); setCatDraft(new Set(selectedCategories)); }}
                className="h-9 min-w-[180px] border rounded px-3 text-sm flex items-center justify-between"
              >
                <span>
                  {selectedCategories.length === 0 ? 'Categories' : `Categories (${selectedCategories.length})`}
                </span>
                <span className="ml-2">▾</span>
              </button>
              {catOpen && (
                <div id="prod-cat-panel" className="absolute z-50 top-10 left-0 w-[360px] bg-white border rounded shadow-lg p-3">
                  <input
                    className="w-full h-9 border rounded px-3 text-sm mb-2"
                    placeholder="Search categories & subcategories"
                    value={catQuery}
                    onChange={(e)=>setCatQuery(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm px-2 py-2">
                    <input type="checkbox" checked={catDraft.size === 0} onChange={() => setCatDraft(new Set())} />
                    <span>Select all</span>
                  </label>
                  <div className="max-h-72 overflow-auto divide-y">
                    {categoryItems.map((it) => (
                      <div key={it.category} className="flex items-center justify-between px-2 py-2 hover:bg-gray-50">
                        <label className="flex items-center gap-2 text-sm flex-1">
                          <input
                            type="checkbox"
                            checked={catDraft.has(it.category)}
                            onChange={(e) => {
                              const next = new Set(catDraft);
                              if (e.target.checked) next.add(it.category); else next.delete(it.category);
                              setCatDraft(next);
                            }}
                          />
                          <span className="truncate">{it.category}</span>
                        </label>
                        <span className="text-xs text-gray-600 whitespace-nowrap">{it.subCount} sub</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <button className="text-blue-700 text-sm" onClick={() => { setCatDraft(new Set()); setCatQuery(''); }}>Clear All</button>
                    <div className="flex gap-2">
                      <button
                        className="px-3 h-8 rounded bg-blue-600 text-white text-sm"
                        onClick={() => { setSelectedCategories(Array.from(catDraft)); setCatOpen(false); setPage(1); }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Brand select */}
              <select
                className="h-9 min-w-[160px] border rounded px-3 text-sm"
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }}
              >
                <option>All</option>
                {Array.from(new Set(products.map(p => p.brand || '-'))).map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>

              {/* Status select */}
              <select
                className="h-9 min-w-[140px] border rounded px-3 text-sm"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <button className="h-9 px-3 rounded border text-blue-700 text-sm">Filters</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input
                  className="h-9 w-80 border rounded pl-7 pr-3 text-sm"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 inline-flex items-center justify-center rounded border hover:bg-gray-50" title="Download">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button className="h-9 w-9 inline-flex items-center justify-center rounded border hover:bg-gray-50" title="Actions">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
                <button className="h-9 w-9 inline-flex items-center justify-center rounded border hover:bg-gray-50" title="Layout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <div>{filtered.length} Results</div>
              {selectedStatus !== 'All' && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs">
                  <span>Status :</span>
                  <span className="font-medium">{selectedStatus} in this center</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">Page {page} of {totalPages}</div>
          </div>

          <div className="overflow-auto border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2 font-medium w-36 cursor-pointer" onClick={() => setSortKey('code')}>Code</th>
                  <th className="text-left px-4 py-2 font-medium cursor-pointer" onClick={() => setSortKey('name')}>Name</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Color</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Size</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Brand</th>
                  <th className="text-left px-4 py-2 font-medium w-48">Category</th>
                  <th className="text-left px-4 py-2 font-medium w-48">Subcategory</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Business unit</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Type</th>
                  <th className="text-right px-4 py-2 font-medium w-32">Sale price(₹)</th>
                  <th className="text-right px-4 py-2 font-medium w-28">MRP (₹)</th>
                  <th className="text-left px-4 py-2 font-medium w-28">Amount</th>
                  <th className="text-left px-4 py-2 font-medium w-24">In use</th>
                  <th className="text-left px-4 py-2 font-medium w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={9}>Loading...</td></tr>
                ) : error ? (
                  <tr><td className="px-4 py-6 text-center text-red-600" colSpan={9}>{error}</td></tr>
                ) : pageRows.length === 0 ? (
                  <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={9}>No products found</td></tr>
                ) : (
                  pageRows.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">{p.code}</td>
                      <td className="px-4 py-2 text-blue-700 hover:underline cursor-pointer">{p.name}</td>
                      <td className="px-4 py-2">{p.color}</td>
                      <td className="px-4 py-2">{p.size}</td>
                      <td className="px-4 py-2">{p.brand}</td>
                      <td className="px-4 py-2">{p.category}</td>
                      <td className="px-4 py-2">{p.subcategory}</td>
                      <td className="px-4 py-2">{p.businessUnit}</td>
                      <td className="px-4 py-2">{p.type}</td>
                      <td className="px-4 py-2 text-right">{formatCurrencyINR(p.salePrice)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrencyINR(p.mrp)}</td>
                      <td className="px-4 py-2">{p.amount}</td>
                      <td className="px-4 py-2">{p.inUse ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                          {p.statusText}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-2 py-2 text-sm">
            <div className="text-gray-600">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded border disabled:opacity-50" onClick={() => setPage(1)} disabled={page === 1}>First</button>
              <button className="px-3 py-1 rounded border disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <button className="px-3 py-1 rounded border disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              <button className="px-3 py-1 rounded border disabled:opacity-50" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


