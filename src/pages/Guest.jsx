import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestTable from '../components/Guest/Guest.jsx';
import Sidebar from '../components/Layouts/sidebar';

export default function GuestLanding() {
  const [guestId, setGuestId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterCenter, setFilterCenter] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [guestStats, setGuestStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    centers: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    apiStatus: 'offline',
    database: 'unknown',
    lastSync: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsProgress, setStatsProgress] = useState(0);
  
  // Guest search states
  const [searchedGuest, setSearchedGuest] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  // Add new guest states
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [addGuestLoading, setAddGuestLoading] = useState(false);
  const [addGuestSuccess, setAddGuestSuccess] = useState(false);
  const [addGuestError, setAddGuestError] = useState(null);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [newGuest, setNewGuest] = useState({
    center_id: '',
    center_name: '',
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    home_no: '',
    gender: 'Male',
    date_of_birth: '',
    is_minor: false,
    nationality: 'Indian',
    language: 'English'
  });

  // Edit guest states
  const [showEditGuestModal, setShowEditGuestModal] = useState(false);
  const [editGuestLoading, setEditGuestLoading] = useState(false);
  const [editGuestSuccess, setEditGuestSuccess] = useState(false);
  const [editGuestError, setEditGuestError] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [editGuestData, setEditGuestData] = useState({
    center_id: '',
    center_name: '',
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    home_no: '',
    gender: 'Male',
    date_of_birth: '',
    is_minor: false,
    nationality: 'Indian',
    language: 'English'
  });
  
  const navigate = useNavigate();

  const openProfile = (e) => {
    e.preventDefault();
    const code = guestId.trim();
    if (!code) return;
    searchGuestByCode(code);
  };

  // Search guest by code
  const searchGuestByCode = async (code) => {
    if (!code) return;
    
    setSearchLoading(true);
    setSearchError(null);
    setSearchedGuest(null);
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/guests/code/${encodeURIComponent(code)}`, {
        headers: { accept: 'application/json' }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setSearchError(`Guest with code "${code}" not found`);
        } else {
          setSearchError(`Failed to fetch guest: ${res.status}`);
        }
        return;
      }
      
      const guestData = await res.json();
      console.log('Guest found:', guestData);
      setSearchedGuest(guestData);
      setSearchError(null);
      
    } catch (error) {
      console.error('Failed to search guest:', error);
      setSearchError('Network error while searching for guest');
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear searched guest
  const clearSearchedGuest = () => {
    setSearchedGuest(null);
    setSearchError(null);
    setGuestId('');
  };

  // Add new guest
  const handleAddGuest = async (e) => {
    e.preventDefault();
    setAddGuestLoading(true);
    setAddGuestError(null);
    setAddGuestSuccess(false);

    try {
      // Validate required fields
      if (!newGuest.center_id || !newGuest.center_name || !newGuest.username || 
          !newGuest.first_name || !newGuest.last_name || !newGuest.phone_no) {
        setAddGuestError('Please fill in all required fields');
        return;
      }

      // Validate email format if provided
      if (newGuest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newGuest.email)) {
        setAddGuestError('Please enter a valid email address');
        return;
      }

      // Validate phone number format
      if (!/^\+[1-9]\d{1,14}$/.test(newGuest.phone_no)) {
        setAddGuestError('Please enter a valid phone number with country code (e.g., +919876543210)');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/guests/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGuest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add guest');
      }

      const addedGuest = await response.json();
      console.log('Guest added successfully:', addedGuest);
      
      setAddGuestSuccess(true);
      setAddGuestError(null);
      
      // Reset form
      setNewGuest({
        center_id: '',
        center_name: '',
        username: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone_no: '',
        home_no: '',
        gender: 'Male',
        date_of_birth: '',
        is_minor: false,
        nationality: 'Indian',
        language: 'English'
      });

      // Refresh guest stats and recent activity
      setTimeout(() => {
        fetchGuestStats();
        fetchRecentActivity();
        setShowAddGuestModal(false);
        setAddGuestSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding guest:', error);
      setAddGuestError(error.message || 'Failed to add guest');
    } finally {
      setAddGuestLoading(false);
    }
  };

  // Reset add guest form
  const resetAddGuestForm = () => {
    setNewGuest({
      center_id: '',
      center_name: '',
      username: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone_no: '',
      home_no: '',
      gender: 'Male',
      date_of_birth: '',
      is_minor: false,
      nationality: 'Indian',
      language: 'English'
    });
    setAddGuestError(null);
    setAddGuestSuccess(false);
  };

  // Fetch available centers for dropdown
  const fetchAvailableCenters = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/centers/', {
        headers: { accept: 'application/json' }
      });
      
      if (response.ok) {
        const centersData = await response.json();
        if (Array.isArray(centersData)) {
          setAvailableCenters(centersData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  // Handle center selection
  const handleCenterChange = (centerId) => {
    const selectedCenter = availableCenters.find(center => center.id === centerId);
    if (selectedCenter) {
      setNewGuest({
        ...newGuest,
        center_id: centerId,
        center_name: selectedCenter.name || selectedCenter.center_name || ''
      });
    }
  };

  // Edit guest functions
  const openEditGuestModal = (guest) => {
    setEditingGuest(guest);
    setEditGuestData({
      center_id: guest.center_id || '',
      center_name: guest.center_name || '',
      username: guest.username || '',
      first_name: guest.first_name || '',
      middle_name: guest.middle_name || '',
      last_name: guest.last_name || '',
      email: guest.email || '',
      phone_no: guest.phone_no || '',
      home_no: guest.home_no || '',
      gender: guest.gender || 'Male',
      date_of_birth: guest.date_of_birth ? guest.date_of_birth.split('T')[0] : '',
      is_minor: guest.is_minor || false,
      nationality: guest.nationality || 'Indian',
      language: guest.language || 'English'
    });
    setShowEditGuestModal(true);
  };

  const handleEditGuest = async (e) => {
    e.preventDefault();
    setEditGuestLoading(true);
    setEditGuestError(null);
    setEditGuestSuccess(false);

    try {
      // Validate required fields
      if (!editGuestData.center_id || !editGuestData.center_name || !editGuestData.username || 
          !editGuestData.first_name || !editGuestData.last_name || !editGuestData.phone_no) {
        setEditGuestError('Please fill in all required fields');
        return;
      }

      // Validate email format if provided
      if (editGuestData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editGuestData.email)) {
        setEditGuestError('Please enter a valid email address');
        return;
      }

      // Validate phone number format
      if (!/^\+[1-9]\d{1,14}$/.test(editGuestData.phone_no)) {
        setEditGuestError('Please enter a valid phone number with country code (e.g., +919876543210)');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/guests/${editingGuest.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editGuestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update guest');
      }

      const updatedGuest = await response.json();
      console.log('Guest updated successfully:', updatedGuest);
      
      setEditGuestSuccess(true);
      setEditGuestError(null);
      
      // Refresh guest stats and recent activity
      setTimeout(() => {
        fetchGuestStats();
        fetchRecentActivity();
        setShowEditGuestModal(false);
        setEditGuestSuccess(false);
        setEditingGuest(null);
      }, 2000);

    } catch (error) {
      console.error('Error updating guest:', error);
      setEditGuestError(error.message || 'Failed to update guest');
    } finally {
      setEditGuestLoading(false);
    }
  };

  const resetEditGuestForm = () => {
    setEditGuestData({
      center_id: '',
      center_name: '',
      username: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone_no: '',
      home_no: '',
      gender: 'Male',
      date_of_birth: '',
      is_minor: false,
      nationality: 'Indian',
      language: 'English'
    });
    setEditGuestError(null);
    setEditGuestSuccess(false);
    setEditingGuest(null);
  };

  // Handle center selection for edit form
  const handleEditCenterChange = (centerId) => {
    const selectedCenter = availableCenters.find(center => center.id === centerId);
    if (selectedCenter) {
      setEditGuestData({
        ...editGuestData,
        center_id: centerId,
        center_name: selectedCenter.name || selectedCenter.center_name || ''
      });
    }
  };

  // Handle search input change with debouncing
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setGuestId(value);
    
    // Clear previous search results when input changes
    if (searchedGuest || searchError) {
      setSearchedGuest(null);
      setSearchError(null);
    }
  };

  // Fetch guest statistics from API
  const fetchGuestStats = async () => {
    try {
      setLoading(true);
      setStatsProgress(0);
      
      // Fetch centers
      const centersRes = await fetch('http://127.0.0.1:8000/centers/', {
        headers: { accept: 'application/json' }
      });
      
      let centers = [];
      if (centersRes.ok) {
        const centersData = await centersRes.json();
        centers = Array.isArray(centersData) ? centersData.map(c => c.name || c.center_name) : [];
      }

      // Use a more efficient approach: fetch in larger batches and estimate total
      const batchSize = 500; // Larger batch size for efficiency
      let allGuests = [];
      let skip = 0;
      let hasMore = true;
      let batchCount = 0;
      let estimatedTotal = 0;
      
      // First, try to get a quick estimate by checking if there are more than 1000 guests
      const largeBatchRes = await fetch('http://127.0.0.1:8000/guests/?skip=0&limit=1000', {
        headers: { accept: 'application/json' }
      });
      
      if (largeBatchRes.ok) {
        const largeBatchData = await largeBatchRes.json();
        if (Array.isArray(largeBatchData)) {
          allGuests = largeBatchData;
          
          // If we got exactly 1000, there might be more
          if (largeBatchData.length === 1000) {
            // Try to get a few more batches to estimate total
            for (let i = 1; i <= 3; i++) {
              const nextBatchRes = await fetch(`http://127.0.0.1:8000/guests/?skip=${i * 1000}&limit=1000`, {
                headers: { accept: 'application/json' }
              });
              
              if (nextBatchRes.ok) {
                const nextBatchData = await nextBatchRes.json();
                if (Array.isArray(nextBatchData) && nextBatchData.length > 0) {
                  allGuests = [...allGuests, ...nextBatchData];
                  setStatsProgress(Math.min((i + 1) * 25, 100));
                  
                  if (nextBatchData.length < 1000) {
                    // We've reached the end
                    break;
                  }
                } else {
                  break;
                }
              } else {
                break;
              }
            }
          }
        }
      }

      // Calculate statistics from the fetched data
      const total = allGuests.length;
      
      // Calculate new guests this month
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const newThisMonth = allGuests.filter(guest => {
        if (!guest.created_at) return false;
        const createdDate = new Date(guest.created_at);
        return createdDate > thirtyDaysAgo;
      }).length;

      // Calculate active guests (guests with recent activity - updated in last 90 days)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const active = allGuests.filter(guest => {
        if (!guest.updated_at) return false;
        const updatedDate = new Date(guest.updated_at);
        return updatedDate > ninetyDaysAgo;
      }).length;

      // Extract unique centers from guest data
      const uniqueCenters = [...new Set(allGuests.map(guest => guest.center_name).filter(Boolean))];
      if (uniqueCenters.length > 0) {
        centers = uniqueCenters;
      }

      console.log('Guest statistics calculated:', { total, active, newThisMonth, centers: centers.length });

      setGuestStats({
        total,
        active,
        newThisMonth,
        centers
      });

    } catch (error) {
      console.error('Failed to fetch guest stats:', error);
      setError('Failed to fetch guest statistics');
      // Fallback to mock data on error
      setGuestStats({
        total: 0,
        active: 0,
        newThisMonth: 0,
        centers: []
      });
    } finally {
      setLoading(false);
      setStatsProgress(100);
    }
  };

  // Fetch recent activity from API
  const fetchRecentActivity = async () => {
    try {
      // Fetch recent guests for activity feed
      const res = await fetch('http://127.0.0.1:8000/guests/?skip=0&limit=10', {
        headers: { accept: 'application/json' }
      });

      if (res.ok) {
        const guests = await res.json();
        const activities = guests.map(guest => ({
          id: guest.id,
          type: 'registration',
          message: 'New guest registered',
          guestName: `${guest.first_name || ''} ${guest.last_name || ''}`.trim() || 'Unknown Guest',
          timestamp: guest.created_at,
          timeAgo: getTimeAgo(guest.created_at)
        }));

        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      setRecentActivity([]);
    }
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      // Test API connectivity
      const startTime = Date.now();
      const res = await fetch('http://127.0.0.1:8000/guests/?skip=0&limit=1', {
        headers: { accept: 'application/json' }
      });
      const responseTime = Date.now() - startTime;

      setSystemStatus({
        apiStatus: res.ok ? 'online' : 'offline',
        database: res.ok ? 'healthy' : 'error',
        lastSync: new Date().toISOString(),
        responseTime: responseTime
      });
    } catch (error) {
      console.error('Failed to check system status:', error);
      setSystemStatus({
        apiStatus: 'offline',
        database: 'error',
        lastSync: null
      });
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return time.toLocaleDateString();
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchGuestStats();
    fetchRecentActivity();
    fetchSystemStatus();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch centers when modal opens
  useEffect(() => {
    if (showAddGuestModal || showEditGuestModal) {
      fetchAvailableCenters();
    }
  }, [showAddGuestModal, showEditGuestModal]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterGender('');
    setFilterCenter('');
    setFilterStatus('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all guest information</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setError(null);
                  fetchGuestStats();
                  fetchRecentActivity();
                  fetchSystemStatus();
                }}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              {loading && (
                <div className="text-xs text-gray-500">
                  Fetching guest data... {statsProgress > 0 && `${Math.round(statsProgress)}%`}
                </div>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button 
                onClick={() => setShowAddGuestModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Guest
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Guest Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={guestId}
                    onChange={handleSearchInputChange}
                    placeholder="Enter guest code (e.g., GUEST128859)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchGuestByCode(guestId.trim());
                      }
                    }}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={openProfile}
                  disabled={!guestId.trim() || searchLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {searchLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    'Search Guest'
                  )}
                </button>
                {searchedGuest && (
                  <button
                    onClick={clearSearchedGuest}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search Tips */}
            {!searchedGuest && !searchError && guestId.trim() && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Press Enter or click "Search Guest" to find this guest</span>
                </div>
              </div>
            )}

            {/* Search Error */}
            {searchError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-800">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {searchError}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchedGuest && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-900">Guest Found</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/guests/${encodeURIComponent(searchedGuest.guest_code)}`)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      View Full Profile
                    </button>
                    <button
                      onClick={() => navigate(`/guests/${encodeURIComponent(searchedGuest.guest_code)}/edit`)}
                      className="px-3 py-1 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors"
                    >
                      Edit Guest
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-blue-800 mb-2">Personal Information</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{searchedGuest.first_name} {searchedGuest.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{searchedGuest.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium">{searchedGuest.date_of_birth ? new Date(searchedGuest.date_of_birth).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minor:</span>
                        <span className="font-medium">{searchedGuest.is_minor ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nationality:</span>
                        <span className="font-medium">{searchedGuest.nationality || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{searchedGuest.language || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-blue-800 mb-2">Contact Information</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{searchedGuest.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{searchedGuest.phone_no || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Center:</span>
                        <span className="font-medium">{searchedGuest.center_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guest Code:</span>
                        <span className="font-mono font-medium text-blue-600">{searchedGuest.guest_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Username:</span>
                        <span className="font-medium">{searchedGuest.username || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="flex justify-between items-center text-xs text-blue-600">
                    <span>Created: {searchedGuest.created_at ? new Date(searchedGuest.created_at).toLocaleString() : 'Unknown'}</span>
                    <span>Last Updated: {searchedGuest.updated_at ? new Date(searchedGuest.updated_at).toLocaleString() : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                {loading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    {statsProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${statsProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{guestStats.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">From API data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Guests</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{guestStats.active.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{guestStats.newThisMonth}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Centers</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{guestStats.centers.length}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guests..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Center</label>
                <select
                  value={filterCenter}
                  onChange={(e) => setFilterCenter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">{loading ? 'Loading centers...' : 'All Centers'}</option>
                  {guestStats.centers.map(center => (
                    <option key={center} value={center}>{center}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="new">New</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="bg-gray-200 h-4 w-3/4 rounded mx-auto"></div>
                      <div className="bg-gray-200 h-3 w-1/2 rounded mx-auto"></div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  )}
                </div>
              ) : (
                recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'registration' ? 'bg-green-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.guestName} - {activity.timeAgo}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setShowAddGuestModal(true)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Guest
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Bulk Import
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  systemStatus.apiStatus === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    systemStatus.apiStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  {systemStatus.apiStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  systemStatus.database === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    systemStatus.database === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  {systemStatus.database === 'healthy' ? 'Healthy' : 'Error'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-sm text-gray-900">
                  {systemStatus.lastSync ? getTimeAgo(systemStatus.lastSync) : 'Never'}
                </span>
              </div>
              {systemStatus.responseTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm text-gray-900">
                    {systemStatus.responseTime}ms
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guest Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Guest List</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing all registered guests with their details
            </p>
          </div>
          <div className="p-6">
            <GuestTable onEditGuest={openEditGuestModal} />
          </div>
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddGuestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add New Guest</h3>
                <button
                  onClick={() => {
                    setShowAddGuestModal(false);
                    resetAddGuestForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddGuest} className="p-6 space-y-6">
              {/* Success/Error Messages */}
              {addGuestSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium">Guest added successfully!</p>
                  </div>
                </div>
              )}

              {addGuestError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-800 font-medium">{addGuestError}</p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Center Information */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newGuest.center_id}
                    onChange={(e) => handleCenterChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a center</option>
                    {availableCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name || center.center_name || center.id}
                      </option>
                    ))}
                  </select>
                  {newGuest.center_name && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {newGuest.center_name}
                    </p>
                  )}
                </div>

                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newGuest.username}
                    onChange={(e) => setNewGuest({...newGuest, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newGuest.first_name}
                    onChange={(e) => setNewGuest({...newGuest, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={newGuest.middle_name}
                    onChange={(e) => setNewGuest({...newGuest, middle_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newGuest.last_name}
                    onChange={(e) => setNewGuest({...newGuest, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newGuest.phone_no}
                    onChange={(e) => setNewGuest({...newGuest, phone_no: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+919876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Number
                  </label>
                  <input
                    type="text"
                    value={newGuest.home_no}
                    onChange={(e) => setNewGuest({...newGuest, home_no: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter home number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newGuest.gender}
                    onChange={(e) => setNewGuest({...newGuest, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={newGuest.date_of_birth}
                    onChange={(e) => setNewGuest({...newGuest, date_of_birth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={newGuest.nationality}
                    onChange={(e) => setNewGuest({...newGuest, nationality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter nationality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={newGuest.language}
                    onChange={(e) => setNewGuest({...newGuest, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newGuest.is_minor}
                      onChange={(e) => setNewGuest({...newGuest, is_minor: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Is Minor</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGuestModal(false);
                    resetAddGuestForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addGuestLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addGuestLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Guest...
                    </div>
                  ) : (
                    'Add Guest'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Guest Modal */}
      {showEditGuestModal && editingGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Guest: {editingGuest.guest_code || editingGuest.id}
                </h3>
                <button
                  onClick={() => {
                    setShowEditGuestModal(false);
                    resetEditGuestForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditGuest} className="p-6 space-y-6">
              {/* Success/Error Messages */}
              {editGuestSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium">Guest updated successfully!</p>
                  </div>
                </div>
              )}

              {editGuestError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-800 font-medium">{editGuestError}</p>
                  </div>
                </div>
              )}

              {/* Guest Info Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-900">Guest Code:</span>
                    <span className="ml-2 text-blue-700">{editingGuest.guest_code || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Created:</span>
                    <span className="ml-2 text-blue-700">
                      {editingGuest.created_at ? new Date(editingGuest.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Center Information */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editGuestData.center_id}
                    onChange={(e) => handleEditCenterChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a center</option>
                    {availableCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name || center.center_name || center.id}
                      </option>
                    ))}
                  </select>
                  {editGuestData.center_name && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {editGuestData.center_name}
                    </p>
                  )}
                </div>

                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editGuestData.username}
                    onChange={(e) => setEditGuestData({...editGuestData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editGuestData.first_name}
                    onChange={(e) => setEditGuestData({...editGuestData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={editGuestData.middle_name}
                    onChange={(e) => setEditGuestData({...editGuestData, middle_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editGuestData.last_name}
                    onChange={(e) => setEditGuestData({...editGuestData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editGuestData.email}
                    onChange={(e) => setEditGuestData({...editGuestData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={editGuestData.phone_no}
                    onChange={(e) => setEditGuestData({...editGuestData, phone_no: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+919876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Number
                  </label>
                  <input
                    type="text"
                    value={editGuestData.home_no}
                    onChange={(e) => setEditGuestData({...editGuestData, home_no: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter home number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editGuestData.gender}
                    onChange={(e) => setEditGuestData({...editGuestData, gender: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editGuestData.date_of_birth}
                    onChange={(e) => setEditGuestData({...editGuestData, date_of_birth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={editGuestData.nationality}
                    onChange={(e) => setEditGuestData({...editGuestData, nationality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter nationality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={editGuestData.language}
                    onChange={(e) => setEditGuestData({...editGuestData, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editGuestData.is_minor}
                      onChange={(e) => setEditGuestData({...editGuestData, is_minor: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Is Minor</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditGuestModal(false);
                    resetEditGuestForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editGuestLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editGuestLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Guest...
                    </div>
                  ) : (
                    'Update Guest'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


