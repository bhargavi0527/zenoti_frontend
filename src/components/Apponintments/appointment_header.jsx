import React, { useState, useEffect } from 'react';
import NewGuestModal from './new_guest_modal';

// Fetch centers from API
async function fetchCenters() {
  try {
    const response = await fetch('http://127.0.0.1:8000/centers/', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const centers = await response.json();
    return centers.map(center => ({
      id: center.id,
      name: center.name,
      address: center.address,
      city: center.city,
      phone: center.phone
    }));
  } catch (error) {
    console.error('Error fetching centers:', error);
    return [];
  }
}

function formatDateLong(date) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  return formatter.format(date);
}

/**
 * AppointmentHeader
 * Presentational header for the Appointments screen, modeled after the provided screenshot.
 *
 * Props:
 * - activeTab: 'rooms' | 'doctors'
 * - onTabChange: (tab: 'rooms' | 'doctors') => void
 * - currentDate: Date
 * - onPrevDate: () => void
 * - onNextDate: () => void
 */
export default function AppointmentHeader({
  activeTab = 'rooms',
  onTabChange = () => {},
  currentDate = new Date(),
  onPrevDate = () => {},
  onNextDate = () => {},
  fullBleedFixed = false,
  trainingCenters = [],
  selectedTrainingCenter = '',
  onTrainingCenterChange = () => {},
  orientation = 'horizontal',
  onOrientationChange = () => {},
  selectedCenterProp = null,
  onGuestCreated = () => {}
}) {
  // State for centers with loading and error handling
  const [centers, setCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(true);
  const [centersError, setCentersError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(selectedTrainingCenter);
  
  // State for new guest modal
  const [newGuestModalOpen, setNewGuestModalOpen] = useState(false);

  // Fetch centers on component mount
  useEffect(() => {
    const loadCenters = async () => {
      setCentersLoading(true);
      setCentersError(null);
      try {
        const fetchedCenters = await fetchCenters();
        setCenters(fetchedCenters);
        
        // Set default selected center if none is selected
        if (!selectedCenter && fetchedCenters.length > 0) {
          const defaultCenter = fetchedCenters[0].name;
          setSelectedCenter(defaultCenter);
          onTrainingCenterChange(defaultCenter);
        }
      } catch (error) {
        console.error('Failed to load centers:', error);
        setCentersError('Failed to load centers');
        setCenters([]);
      } finally {
        setCentersLoading(false);
      }
    };

    loadCenters();
  }, [selectedCenter, onTrainingCenterChange]);

  // Handle center selection change
  const handleCenterChange = (centerName) => {
    setSelectedCenter(centerName);
    onTrainingCenterChange(centerName);
  };

  const wrapperClassName = fullBleedFixed
    ? 'w-screen fixed top-0 inset-x-0 z-40'
    : 'w-full';
  return (
    <div className={wrapperClassName}>
      {/* Top dark bar */}
      <div className="w-full bg-blue-900 text-white">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          {/* Search */}
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-900/60">
                {/* magnifier */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="w-full rounded-md bg-white/95 text-blue-950 placeholder:text-blue-900/60 pl-9 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Name, Phone, Email, Code"
              />
              <button
                className="absolute inset-y-0 right-2 flex items-center text-blue-900/60 hover:text-blue-700"
                onClick={() => setNewGuestModalOpen(true)}
                title="Add New Guest"
              >
                {/* contact/add icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="16" y1="11" x2="22" y2="11" />
                </svg>
              </button>
            </div>
          </div>

          {/* Date pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevDate}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-800 hover:bg-blue-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="flex items-center rounded-md bg-blue-800 px-4 h-9 text-sm font-medium">
              {formatDateLong(currentDate)}
            </div>
            <button
              type="button"
              onClick={onNextDate}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-800 hover:bg-blue-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Right action icons and location */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {centersLoading ? (
                <div className="bg-white/10 text-white/95 text-sm h-8 pl-3 pr-8 rounded-md flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading centers...
                </div>
              ) : centersError ? (
                <div className="bg-red-500/20 text-red-200 text-sm h-8 pl-3 pr-8 rounded-md flex items-center">
                  Failed to load centers
                </div>
              ) : (
                <>
                  <select
                    className="appearance-none bg-white/10 text-white/95 text-sm h-8 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={selectedCenter}
                    onChange={(e) => handleCenterChange(e.target.value)}
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.name} className="text-blue-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/80">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary row (light background) */}
      <div className="w-full bg-blue-50 text-blue-900">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left cluster: view toggles + tabs */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-blue-900/70">
              <button
                type="button"
                title="Horizontal view"
                onClick={() => onOrientationChange('horizontal')}
                className={`w-8 h-8 inline-flex items-center justify-center rounded ${orientation === 'horizontal' ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-700'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                title="Vertical view"
                onClick={() => onOrientationChange('vertical')}
                className={`w-8 h-8 inline-flex items-center justify-center rounded ${orientation === 'vertical' ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-700'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                className={`pb-2 text-sm font-medium border-b-2 ${
                  activeTab === 'rooms' ? 'border-blue-600 text-blue-700' : 'border-transparent text-blue-900/70'
                }`}
                onClick={() => onTabChange('rooms')}
              >
                Rooms
              </button>
              <button
                type="button"
                className={`pb-2 text-sm font-medium border-b-2 ${
                  activeTab === 'doctors' ? 'border-blue-600 text-blue-700' : 'border-transparent text-blue-900/70'
                }`}
                onClick={() => onTabChange('doctors')}
              >
                Choose Your Doctor
              </button>
            </div>
          </div>

          {/* Right icons (placeholders) */}
          <div className="flex items-center gap-4 text-blue-900/70">
            {/* envelope with badge */}
            <div className="relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="absolute -top-1 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] text-white">0</span>
            </div>
            {/* {Array.from({ length: 7 }).map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
              </svg>
            ))} */}
          </div>
        </div>
      </div>
      
      {/* New Guest Modal */}
      <NewGuestModal
        open={newGuestModalOpen}
        onClose={() => setNewGuestModalOpen(false)}
        onGuestCreated={(guest) => {
          onGuestCreated(guest);
          setNewGuestModalOpen(false);
        }}
        selectedCenter={selectedCenterProp}
      />
    </div>
  );
}


