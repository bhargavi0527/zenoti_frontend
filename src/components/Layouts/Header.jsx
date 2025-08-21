import { useState, useEffect, useRef } from 'react';

function Header() {
  const [selectedLocation, setSelectedLocation] = useState('kerala');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  const locations = [
    { value: 'kerala', label: 'Kerala' },
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'west-bengal', label: 'West Bengal' }
  ];

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleAnnouncementClick = () => {
    console.log('Announcement clicked');
    // Add announcement functionality here
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileOptionClick = (option) => {
    console.log(`${option} clicked`);
    setShowProfileDropdown(false);
    // Add specific functionality for each option here
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleChatClick = () => {
    console.log('Chat support clicked');
    // Add chat support functionality here
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Brand and Location */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oliva - Kerala</h1>
        </div>

        {/* Right Side - Location Dropdown, Announcement, Profile, Chat */}
        <div className="flex items-center space-x-4">
          {/* Location Dropdown */}
          <div className="relative">
            <select 
              value={selectedLocation}
              onChange={handleLocationChange}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Announcement Icon */}
          <button 
            onClick={handleAnnouncementClick}
            className="w-8 h-8 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors duration-200"
            title="Announcements"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </button>

          {/* Admin Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={handleProfileClick}
              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors duration-200"
              title="Profile"
            >
              <span className="text-sm font-medium">KS</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">KS</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Koyyana Sai Mythree</div>
                    </div>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="py-2">
                  <button
                    onClick={() => handleProfileOptionClick('Edit Profile')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700">Edit Profile</span>
                  </button>

                  <button
                    onClick={() => handleProfileOptionClick('Manage Access')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-gray-700">Manage Access</span>
                  </button>

                  <button
                    onClick={() => handleProfileOptionClick('Tasks')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Tasks</span>
                  </button>

                  <button
                    onClick={() => handleProfileOptionClick('Schedule')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4.586A1 1 0 0116 2.586L19.414 6A1 1 0 0119 7H15a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-gray-700">Schedule</span>
                  </button>

                  <button
                    onClick={() => handleProfileOptionClick('Appointments')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4.586A1 1 0 0116 2.586L19.414 6A1 1 0 0119 7H15a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-gray-700">Appointments</span>
                  </button>

                  <button
                    onClick={() => handleProfileOptionClick('Zenoti University')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-700">Zenoti University</span>
                  </button>

                  <button
                    onClick={() => handleProfileOptionClick('Log Out')}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-red-500">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Support */}
          <button 
            onClick={handleChatClick}
            className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-400 rounded-full flex items-center justify-center text-white hover:from-teal-500 hover:to-green-500 transition-all duration-200"
            title="Chat Support"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
