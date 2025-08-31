import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestTable({ onEditGuest }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterCenter, setFilterCenter] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * pageSize;
      const res = await fetch(`http://127.0.0.1:8000/guests/?skip=${skip}&limit=${pageSize}`, {
        headers: { accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);

      // Lookahead to determine if next page exists
      try {
        const nextRes = await fetch(`http://127.0.0.1:8000/guests/?skip=${skip + pageSize}&limit=1`, {
          headers: { accept: 'application/json' }
        });
        if (!nextRes.ok) throw new Error('head check failed');
        const nextData = await nextRes.json();
        setHasNext(Array.isArray(nextData) && nextData.length > 0);
      } catch {
        // Fallback: infer from current page size
        setHasNext(Array.isArray(data) && data.length === pageSize);
      }
    } catch (e) {
      console.error('Failed to fetch guests', e);
      setError('Failed to fetch guests');
      setRows([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGuests(); }, [page]);

  // Filter and search functionality
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(guest => 
        guest.guest_code?.toLowerCase().includes(query) ||
        guest.first_name?.toLowerCase().includes(query) ||
        guest.last_name?.toLowerCase().includes(query) ||
        guest.email?.toLowerCase().includes(query) ||
        guest.phone_no?.includes(query)
      );
    }

    // Gender filter
    if (filterGender) {
      filtered = filtered.filter(guest => guest.gender === filterGender);
    }

    // Center filter
    if (filterCenter) {
      filtered = filtered.filter(guest => guest.center_name === filterCenter);
    }

    // Status filter (mock implementation)
    if (filterStatus) {
      filtered = filtered.filter(guest => {
        if (filterStatus === 'active') return true; // Mock: all guests are active
        if (filterStatus === 'new') return guest.created_at && new Date(guest.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return true;
      });
    }

    return filtered;
  }, [rows, searchQuery, filterGender, filterCenter, filterStatus]);

  const headers = useMemo(() => (
    ['Code', 'Name', 'Gender', 'DOB', 'Phone', 'Email', 'Center', 'Status', 'Actions']
  ), []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (guest) => {
    // Mock status logic - in real app, this would come from API
    const isNew = guest.created_at && new Date(guest.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    if (isNew) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          New
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Active
      </span>
    );
  };

  return (
    <div>
      {/* Table Header with Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <span className="text-sm text-gray-600">
            {filteredRows.length} of {rows.length} guests
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
            disabled={page === 1}
            onClick={() => setPage((p)=>Math.max(1, p-1))}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page numbers */}
          {page > 2 && (
            <>
              <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setPage(1)}>1</button>
              <span className="px-2 text-gray-500">…</span>
            </>
          )}
          {page > 1 && (
            <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setPage(page-1)}>{page-1}</button>
          )}
          <button className="px-3 py-2 text-sm border rounded-lg bg-blue-600 text-white">{page}</button>
          {hasNext && (
            <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setPage(page+1)}>{page+1}</button>
          )}
          
          <button
            className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
            disabled={!hasNext}
            onClick={() => setPage((p)=>p+1)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left text-gray-600 border-b border-gray-200">
              {headers.map(h => (
                <th key={h} className="px-4 py-3 font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={headers.length}>
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading guests...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-4 py-8 text-center text-red-600" colSpan={headers.length}>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={headers.length}>
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">No guests found</p>
                    {searchQuery && <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>}
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((g, idx) => (
                <tr key={g.id || idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {g.guest_code || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {g.first_name || ''} {g.last_name || ''}
                      </div>
                      {g.email && (
                        <div className="text-xs text-gray-500">{g.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      g.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                      g.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {g.gender || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(g.date_of_birth)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm">{g.phone_no || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">{g.email || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">{g.center_name || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(g)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={()=>navigate(`/guests/${encodeURIComponent(g.guest_code || g.id)}`)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => onEditGuest && onEditGuest(g)}
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-2 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


