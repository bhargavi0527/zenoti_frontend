import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [masterOpen, setMasterOpen] = useState(() => location.pathname.startsWith('/master'));

  const getActiveItem = () => {
    if (location.pathname === '/admin') return 'admin';
    if (location.pathname === '/appointments') return 'appointments';
    if (location.pathname === '/master' || location.pathname.startsWith('/master/')) return 'master';
    return 'admin';
  };
  const [activeItem, setActiveItem] = useState(getActiveItem());

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (item.path) navigate(item.path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-blue-950 text-white flex flex-col border-r border-blue-800 overflow-y-auto">
      <div className="px-4 py-3 flex items-center gap-3 border-b border-blue-800">
        <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center font-semibold">Z</div>
        <div className="text-sm font-medium">OLIVA</div>
      </div>
      <div className="p-3 border-b border-blue-800">
        <button
          onClick={() => setShowSearch((v)=>!v)}
          className="w-full text-left text-xs px-3 py-2 rounded bg-blue-900 hover:bg-blue-800"
        >
          {showSearch ? 'Hide search' : 'Search'}
        </button>
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="mt-3">
            <input
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              placeholder="Search for services..."
              className="w-full px-3 py-2 rounded bg-white text-gray-900"
            />
          </form>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <button
          onClick={() => handleItemClick({ id: 'guest', path: '/guest' })}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded ${activeItem==='guest' ? 'bg-blue-800' : 'hover:bg-blue-900'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="text-sm">Guest</span>
        </button>
        <button
          onClick={() => handleItemClick({ id: 'admin', path: '/admin' })}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded ${activeItem==='admin' ? 'bg-blue-800' : 'hover:bg-blue-900'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span className="text-sm">Admin</span>
        </button>
        <button
          onClick={() => handleItemClick({ id: 'appointments', path: '/appointments' })}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded ${activeItem==='appointments' ? 'bg-blue-800' : 'hover:bg-blue-900'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4.586A1 1 0 0116 2.586L19.414 6A1 1 0 0119 7H15a2 2 0 01-2-2z"/></svg>
          <span className="text-sm">Appointments</span>
        </button>

        <button
          onClick={() => setMasterOpen((v)=>!v)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded ${activeItem==='master' ? 'bg-blue-800' : 'hover:bg-blue-900'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18"/></svg>
          <span className="text-sm">Master</span>
          <span className="ml-auto text-xs opacity-75">{masterOpen ? '▾' : '▸'}</span>
        </button>
        {masterOpen && (
          <div className="ml-6 space-y-1">
            <button onClick={()=>handleItemClick({ id: 'master-services', path: '/master/services' })} className={`w-full text-left text-sm px-3 py-2 rounded ${location.pathname==='/master/services' ? 'bg-blue-800' : 'hover:bg-blue-900'}`}>Services</button>
            <button onClick={()=>handleItemClick({ id: 'master-products', path: '/master/products' })} className={`w-full text-left text-sm px-3 py-2 rounded ${location.pathname==='/master/products' ? 'bg-blue-800' : 'hover:bg-blue-900'}`}>Products</button>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
