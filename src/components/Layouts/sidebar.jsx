import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [masterOpen, setMasterOpen] = useState(() => location.pathname.startsWith('/master'));
  
  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname === '/admin') return 'admin';
    if (location.pathname === '/appointments') return 'appointments';
    if (location.pathname === '/master') return 'master';
    if (location.pathname.startsWith('/master/')) return 'master';
    return 'admin'; // default
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Here you can implement the search functionality
      alert(`Searching for: ${searchQuery}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    setShowSearch(false); // Hide search when navigating
    if (item.id !== 'master') setMasterOpen(false);
    navigate(item.path);
  };

  return (
    <div className="w-16 bg-blue-900 flex flex-col items-center py-4 space-y-6 rounded-tr-lg relative">
      {/* Search Icon */}
      <button
        onClick={handleSearchClick}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
          showSearch
            ? 'bg-blue-700 text-white'
            : 'text-white hover:bg-blue-800'
        }`}
        title="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Admin Icon */}
      <button
        onClick={() => handleItemClick({ id: 'admin', path: '/admin' })}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
          activeItem === 'admin'
            ? 'bg-blue-700 text-white'
            : 'text-white hover:bg-blue-800'
        }`}
        title="Admin"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {/* Appointments Icon */}
      <button
        onClick={() => handleItemClick({ id: 'appointments', path: '/appointments' })}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
          activeItem === 'appointments'
            ? 'bg-blue-700 text-white'
            : 'text-white hover:bg-blue-800'
        }`}
        title="Appointments"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4.586A1 1 0 0116 2.586L19.414 6A1 1 0 0119 7H15a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Master Icon */}
      <button
        onClick={() => setMasterOpen((v) => !v)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
          activeItem === 'master'
            ? 'bg-blue-700 text-white'
            : 'text-white hover:bg-blue-800'
        }`}
        title="Master"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </button>

      {/* Master submenu full-height panel */}
      {masterOpen && (
        <div className="fixed left-16 top-0 bottom-0 w-64 bg-blue-800 text-white shadow-xl z-40">
          <div className="px-5 py-5 text-lg font-semibold">Master data</div>
          <nav className="px-3 space-y-2">
            <button
              onClick={() => handleItemClick({ id: 'master-services', path: '/master/services' })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded ${
                location.pathname === '/master/services' ? 'bg-blue-700' : 'hover:bg-blue-700/80'
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L8 21l4-1.75L16 21l-1.75-4L19 12l-4-.25L12 8l-3 3.75L5 12l4.75 5z" />
              </svg>
              <span className="text-sm">Services</span>
            </button>
            <button
              onClick={() => handleItemClick({ id: 'master-products', path: '/master/products' })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded ${
                location.pathname === '/master/products' ? 'bg-blue-700' : 'hover:bg-blue-700/80'
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              </svg>
              <span className="text-sm">Products</span>
            </button>
          </nav>
        </div>
      )}

      {/* Search Bar Overlay */}
      {showSearch && (
        <div className="absolute left-16 top-0 bg-white rounded-lg shadow-lg p-4 w-80 z-50">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
