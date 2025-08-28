import React, { useState } from 'react';

// Guest creation API function
async function createGuest(guestData, selectedCenter) {
  try {
    const payload = {
      center_id: (selectedCenter && selectedCenter.id) ? selectedCenter.id : "851e63e9-6332-4a72-bf24-7a3d035e0f21",
      center_name: (selectedCenter && (selectedCenter.name || typeof selectedCenter === 'string')) ? (selectedCenter.name || selectedCenter) : "Oliva Banjara Hills",
      username: guestData.username,
      first_name: guestData.first_name,
      middle_name: guestData.middle_name || '',
      last_name: guestData.last_name,
      email: guestData.email,
      phone_no: guestData.phone_no,
      home_no: guestData.home_no || '+91',
      gender: guestData.gender,
      is_minor: !!guestData.is_minor,
      nationality: guestData.nationality || 'Indian',
      language: guestData.language || 'English'
    };
    // Only include date_of_birth if provided (server rejects empty string)
    if (guestData.date_of_birth) {
      payload.date_of_birth = guestData.date_of_birth;
    }

    const response = await fetch('http://127.0.0.1:8000/guests/', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(()=> '');
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating guest:', error);
    throw error;
  }
}

export default function NewGuestModal({
  open,
  onClose,
  onGuestCreated,
  selectedCenter = null
}) {
  if (!open) return null;

  const [mobile, setMobile] = useState('+91');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [referral, setReferral] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!first || !last || !email || mobile === '+91') {
      alert('Please fill in all required fields (marked with *)');
      return;
    }

    try {
      setIsCreating(true);
      
      const guestData = {
        username: `${first.toLowerCase()}${last.toLowerCase()}${Date.now()}`,
        first_name: first,
        middle_name: '',
        last_name: last,
        email: email,
        phone_no: mobile,
        home_no: '+91',
        gender: gender,
        // Do not send empty date; leave undefined when not set
        date_of_birth: undefined,
        is_minor: isMinor,
        nationality: 'Indian',
        language: 'English'
      };

      const guestResponse = await createGuest(guestData, selectedCenter);
      console.log('Guest created successfully:', guestResponse);
      
      if (onGuestCreated) {
        onGuestCreated(guestResponse);
      }
      
      // Reset form
      setMobile('+91');
      setFirst('');
      setLast('');
      setCode('');
      setEmail('');
      setGender('');
      setReferral('');
      setIsMinor(false);
      
      onClose();
    } catch (error) {
      console.error('Failed to create guest:', error);
      alert('Failed to create guest. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[95vw] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-900 text-white">
          <div className="font-semibold text-lg">New Guest</div>
          <button 
            className="text-white hover:text-gray-200 text-xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Mobile */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">Mobile *</label>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-sm">🇮🇳</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* First Name */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">First *</label>
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">Last *</label>
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          {/* Code */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          {/* Gender */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">Gender *</label>
            <div className="flex-1 relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Referral */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-700">Referral</label>
            <div className="flex-1 relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Minor Checkbox */}
          <div className="flex items-center gap-3">
            <div className="w-16"></div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={isMinor}
                onChange={(e) => setIsMinor(e.target.checked)}
              />
              Guest is a minor
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-md font-medium ${
              isCreating 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
