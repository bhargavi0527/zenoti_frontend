import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../Layouts/sidebar';

function formatCurrencyINR(value) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));
  } catch {
    return value;
  }
}

export default function ServiceMaster() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [centers, setCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(true);
  const [centersError, setCentersError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]); // array of category names
  const [selectedServiceType, setSelectedServiceType] = useState('All');
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]); // multi-select
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [catOpen, setCatOpen] = useState(false);
  const [catQuery, setCatQuery] = useState('');
  const [catDraft, setCatDraft] = useState(new Set());
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeDraft, setTypeDraft] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://127.0.0.1:8000/services/', { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Normalize minimal fields we know exist; fill placeholders for missing columns
        const normalized = Array.isArray(data)
          ? data.map((s, idx) => ({
              id: s.id ?? idx,
              code: s.service_code || s.code || String(s.id || idx),
              name: s.name || s.title || 'Untitled',
              price: s.price ?? 0,
              isActive: s.is_active ?? true,
              taxIncluded: s.tax_included ?? false,
              taxGroup: s.tax_group || '-',
              onlineBooking: s.online_booking ?? false,
              duration: s.duration ?? 0,
              category: s.category || '-',
              subcategory: s.subcategory || '-',
              businessUnit: s.business_unit || s.businessUnit || '-',
              serviceType: s.service_type || 'Regular service',
              autoConsumption: s.auto_consumption || '-',
              prerequisiteServices: s.prerequisite_services || '-',
              finishingServices: s.finishing_services || '-',
              addons: s.add_ons || s.addons || '-',
            }))
          : [];
        setServices(normalized);
      } catch (e) {
        console.error('Failed to load services', e);
        setError('Failed to load services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Fetch centers for the top-right selector
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = services;
    if (q) {
      rows = rows.filter((r) =>
        (r.code || '').toLowerCase().includes(q) ||
        (r.name || '').toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q) ||
        (r.subcategory || '').toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      const set = new Set(selectedCategories);
      rows = rows.filter((r) => set.has(r.category || '-'));
    }
    if (selectedServiceTypes.length > 0) {
      const tset = new Set(selectedServiceTypes);
      rows = rows.filter((r) => tset.has(r.serviceType || '-'));
    } else if (selectedServiceType !== 'All') {
      rows = rows.filter((r) => (r.serviceType || '-') === selectedServiceType);
    }
    if (selectedStatus !== 'All') {
      const wantActive = selectedStatus === 'Active';
      rows = rows.filter((r) => Boolean(r.isActive) === wantActive);
    }
    const dir = sort.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return rows;
  }, [services, search, selectedCategories, selectedServiceType, selectedServiceTypes, selectedStatus, sort]);

  // Build categories -> subcategories map for dropdown
  const categoriesMap = useMemo(() => {
    const map = new Map();
    services.forEach((s) => {
      const cat = s.category || '-';
      const sub = s.subcategory || '-';
      if (!map.has(cat)) map.set(cat, new Set());
      map.get(cat).add(sub);
    });
    return map;
  }, [services]);

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

  const serviceTypeItems = useMemo(() => {
    const items = Array.from(new Set(services.map(s => s.serviceType || '-'))).filter(Boolean);
    return items.sort((a,b)=>String(a).localeCompare(String(b)));
  }, [services]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!catOpen) return;
    const onClick = (e) => {
      const el = document.getElementById('cat-filter-panel');
      const btn = document.getElementById('cat-filter-button');
      if (!el || !btn) return;
      if (!el.contains(e.target) && !btn.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [catOpen]);

  useEffect(() => {
    if (!typeOpen) return;
    const onClick = (e) => {
      const el = document.getElementById('type-filter-panel');
      const btn = document.getElementById('type-filter-button');
      if (!el || !btn) return;
      if (!el.contains(e.target) && !btn.contains(e.target)) setTypeOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [typeOpen]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const setSortKey = (key) => {
    setPage(1);
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-0 flex">
        <Sidebar />
        <div className="flex-1 p-4 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Manage services</h1>
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

        {/* Filters toolbar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 relative">
            {/* Categories dropdown */}
            <button
              id="cat-filter-button"
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
              <div id="cat-filter-panel" className="absolute z-50 top-10 left-0 w-[360px] bg-white border rounded shadow-lg p-3">
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
            {/* Service type dropdown */}
            <button
              id="type-filter-button"
              type="button"
              onClick={() => { setTypeOpen((v)=>!v); setTypeDraft(new Set(selectedServiceTypes)); }}
              className="h-9 min-w-[160px] border rounded px-3 text-sm flex items-center justify-between"
            >
              <span>
                {selectedServiceTypes.length === 0 ? 'Service type' : `Service type (${selectedServiceTypes.length})`}
              </span>
              <span className="ml-2">▾</span>
            </button>
            {typeOpen && (
              <div id="type-filter-panel" className="absolute z-50 top-10 left-[200px] w-[320px] bg-white border rounded shadow-lg p-3">
                <label className="flex items-center gap-2 text-sm px-2 py-2">
                  <input type="checkbox" checked={typeDraft.size === 0} onChange={() => setTypeDraft(new Set())} />
                  <span>Select all</span>
                </label>
                <div className="max-h-72 overflow-auto divide-y">
                  {serviceTypeItems.map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm px-2 py-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={typeDraft.has(t)}
                        onChange={(e) => {
                          const next = new Set(typeDraft);
                          if (e.target.checked) next.add(t); else next.delete(t);
                          setTypeDraft(next);
                        }}
                      />
                      <span className="truncate">{t}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button className="text-blue-700 text-sm" onClick={() => setTypeDraft(new Set())}>Clear All</button>
                  <div className="flex gap-2">
                    <button
                      className="px-3 h-8 rounded bg-blue-600 text-white text-sm"
                      onClick={() => { setSelectedServiceTypes(Array.from(typeDraft)); setTypeOpen(false); setPage(1); }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                placeholder="Search services"
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

        <div>
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
                  <th className="text-left px-4 py-2 font-medium w-24 cursor-pointer" onClick={() => setSortKey('code')}>Code</th>
                  <th className="text-left px-4 py-2 font-medium cursor-pointer" onClick={() => setSortKey('name')}>Name</th>
                  <th className="text-right px-4 py-2 font-medium w-32 cursor-pointer" onClick={() => setSortKey('price')}>Price (₹)</th>
                  <th className="text-left px-4 py-2 font-medium w-28">Tax included</th>
                  <th className="text-left px-4 py-2 font-medium w-28">Tax group</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Online booking</th>
                  <th className="text-right px-4 py-2 font-medium w-28 cursor-pointer" onClick={() => setSortKey('duration')}>Duration</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Category</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Subcategory</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Business unit</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Service type</th>
                  <th className="text-left px-4 py-2 font-medium w-64">Auto consumption</th>
                  <th className="text-left px-4 py-2 font-medium w-56">Prerequisite services</th>
                  <th className="text-left px-4 py-2 font-medium w-56">Finishing services</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Add-ons</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={15}>Loading...</td></tr>
                ) : error ? (
                  <tr><td className="px-4 py-6 text-center text-red-600" colSpan={15}>{error}</td></tr>
                ) : pageRows.length === 0 ? (
                  <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={15}>No services found</td></tr>
                ) : (
                  pageRows.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">{s.code}</td>
                      <td className="px-4 py-2 text-blue-700 hover:underline cursor-pointer">{s.name}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{formatCurrencyINR(s.price)}</td>
                      <td className="px-4 py-2">{s.taxIncluded ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">{s.taxGroup}</td>
                      <td className="px-4 py-2">{s.onlineBooking ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2 text-right">{s.duration || 0}</td>
                      <td className="px-4 py-2">{s.category}</td>
                      <td className="px-4 py-2">{s.subcategory}</td>
                      <td className="px-4 py-2">{s.businessUnit}</td>
                      <td className="px-4 py-2">{s.serviceType}</td>
                      <td className="px-4 py-2 truncate max-w-[18rem]" title={String(s.autoConsumption)}>{String(s.autoConsumption)}</td>
                      <td className="px-4 py-2 truncate max-w-[14rem]" title={String(s.prerequisiteServices)}>{String(s.prerequisiteServices)}</td>
                      <td className="px-4 py-2 truncate max-w-[14rem]" title={String(s.finishingServices)}>{String(s.finishingServices)}</td>
                      <td className="px-4 py-2 truncate max-w-[14rem]" title={String(s.addons)}>{String(s.addons)}</td>
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
    </div>
  );
}


