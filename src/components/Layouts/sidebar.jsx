import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname === '/admin') return 'admin';
    if (location.pathname === '/appointments') return 'appointments';
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
