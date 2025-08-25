import React, { useMemo, useState, useEffect } from 'react';

function indexToTime(index, startHour, slotMinutes) {
  const totalMinutes = startHour * 60 + index * slotMinutes;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours24 < 12 ? 'AM' : 'PM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function timeOptions(totalSlots, startHour, slotMinutes) {
  return Array.from({ length: totalSlots }).map((_, i) => ({
    value: i,
    label: indexToTime(i, startHour, slotMinutes)
  }));
}

// Guest creation API function
async function createGuest(guestData, selectedCenter) {
  try {
    const response = await fetch('http://127.0.0.1:8000/guests/', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        center_id: selectedCenter?.id || "851e63e9-6332-4a72-bf24-7a3d035e0f21",
        center_name: selectedCenter?.name || "Oliva Banjara Hills",
        username: guestData.username,
        first_name: guestData.first_name,
        middle_name: guestData.middle_name,
        last_name: guestData.last_name,
        email: guestData.email,
        phone_no: guestData.phone_no,
        home_no: guestData.home_no,
        gender: guestData.gender,
        date_of_birth: guestData.date_of_birth,
        is_minor: guestData.is_minor,
        nationality: guestData.nationality,
        language: guestData.language
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating guest:', error);
    throw error;
  }
}

// Appointment creation API function
async function createBackendAppointment(appointmentPayload) {
  try {
    const response = await fetch('http://127.0.0.1:8000/appointments/', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

// Appointment update API function (PATCH)
async function patchBackendAppointment(appointmentId, partialPayload) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partialPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error patching appointment:', error);
    throw error;
  }
}

export default function AppointmentDialog({
  open,
  onClose,
  onSave,
  startIndex,
  resource,
  rooms = [],
  doctors = [],
  services = [],
  selectedCenter = null,
  currentDate = new Date(),
  startHour = 9,
  endHour = 20,
  slotMinutes = 15,
  mode = 'create',
  initial = null,
  onDelete = null
}) {
  if (!open) return null;

  const totalSlots = useMemo(() => ((endHour - startHour) * 60) / slotMinutes, [endHour, startHour, slotMinutes]);

  // Guest fields
  const [mobile, setMobile] = useState(initial?.guestPhone || '+91');
  const [first, setFirst] = useState(initial?.guestFirstName || '');
  const [middle, setMiddle] = useState(initial?.guestMiddleName || '');
  const [last, setLast] = useState(initial?.guestLastName || '');
  const [email, setEmail] = useState(initial?.guestEmail || '');
  const [gender, setGender] = useState(initial?.guestGender || '');
  const [referral, setReferral] = useState(initial?.referral || '');
  const [isMinor, setIsMinor] = useState(initial?.isMinor || false);
  const [dateOfBirth, setDateOfBirth] = useState(initial?.dateOfBirth || '');
  const [nationality, setNationality] = useState(initial?.nationality || 'Indian');
  const [language, setLanguage] = useState(initial?.language || 'English');
  const [homeNo, setHomeNo] = useState(initial?.homeNo || '+91');
  const [username, setUsername] = useState(initial?.username || '');
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);

  // Appointment fields
  const [request, setRequest] = useState(initial?.request || 'Any');
  const [doctor, setDoctor] = useState(initial?.doctor || '');
  const [room, setRoom] = useState(initial?.resource || resource || rooms[0] || '');
  const [durationSlots, setDurationSlots] = useState(initial?.durationSlots || 1);
  const [startIdx, setStartIdx] = useState(initial?.startIndex ?? startIndex ?? 0);
  const [notes, setNotes] = useState(initial?.notes || '');
  const [tab, setTab] = useState('service'); // 'service' | 'package'

  // Use fetched services instead of hardcoded catalog
  const [selectedService, setSelectedService] = useState(services[0]?.name || '');
  const [servicesAdded, setServicesAdded] = useState(initial?.services || []);

  useEffect(() => {
    setStartIdx(initial?.startIndex ?? startIndex ?? 0);
    setRoom(initial?.resource || resource || rooms[0] || '');
    if (initial?.durationSlots) setDurationSlots(initial.durationSlots);
  }, [startIndex, resource, rooms, initial]);

  const endIdx = Math.min(totalSlots, startIdx + durationSlots);

  const computeScheduledTimeIso = (dateObj, startIndexLocal) => {
    try {
      const startMinutes = startHour * 60 + startIndexLocal * slotMinutes;
      const hours24 = Math.floor(startMinutes / 60);
      const minutes = startMinutes % 60;
      const dt = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hours24, minutes, 0);
      return dt.toISOString();
    } catch (err) {
      console.error('Failed to compute scheduled_time:', err);
      return new Date().toISOString();
    }
  };

  const formatYmd = (dateObj) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const doSave = async () => {
    try {
      setIsCreatingGuest(true);
      
      // Ensure there is a guest in the backend (use safe defaults if fields are empty)
      let guestId = null;
      try {
        const safeFirst = first || 'Guest';
        const safeLast = last || 'User';
        const safeEmail = email || `${Date.now()}@example.com`;
        const safeMobile = (mobile && mobile !== '+91') ? mobile : '+91';
        const guestData = {
          username: username || `${safeFirst.toLowerCase()}${safeLast.toLowerCase()}${Date.now()}`,
          first_name: safeFirst,
          middle_name: middle || '',
          last_name: safeLast,
          email: safeEmail,
          phone_no: safeMobile,
          home_no: homeNo || '+91',
          gender: gender || 'Other',
          date_of_birth: dateOfBirth || '',
          is_minor: !!isMinor,
          nationality: nationality || 'Indian',
          language: language || 'English'
        };
        const guestResponse = await createGuest(guestData, selectedCenter);
        guestId = guestResponse?.id || null;
        if (!guestId) throw new Error('No guest id returned');
        console.log('Guest created successfully:', guestResponse);
      } catch (error) {
        console.error('Failed to ensure guest exists:', error);
      }

      const labelBase = (servicesAdded[0]?.serviceName)
        || (first || last ? `${first} ${last}`.trim() : (initial?.label || 'New Appointment'));
      
      // Prepare and create backend appointment (create mode)
      let backendAppointmentId = null;
      try {
        // Choose doctor/service fallbacks if not explicitly set
        const selectedDoctorObj = doctors.find((d) => (d.name || d) === doctor) || doctors[0] || null;
        const chosenServiceName = selectedService || servicesAdded[0]?.serviceName || services[0]?.name;
        const selectedServiceObj = services.find((s) => s.name === chosenServiceName) || null;
        const scheduledTimeISO = computeScheduledTimeIso(currentDate, startIdx);
        const appointmentDate = formatYmd(currentDate);

        if (selectedCenter?.id && selectedDoctorObj?.id && selectedServiceObj?.id && guestId) {
          const backendPayload = {
            guest_id: guestId,
            center_id: selectedCenter.id,
            provider_id: selectedDoctorObj.id,
            service_id: selectedServiceObj.id,
            status: 'scheduled',
            notes: notes || '',
            scheduled_time: scheduledTimeISO,
            appointment_date: appointmentDate
          };
          const created = await createBackendAppointment(backendPayload);
          console.log('Appointment created on backend:', created);
          backendAppointmentId = created?.id || null;
        } else {
          console.warn('Skipping backend appointment creation due to missing ids', {
            hasGuestId: !!guestId,
            centerId: selectedCenter?.id,
            doctorId: selectedDoctorObj?.id,
            serviceId: selectedServiceObj?.id
          });
        }
      } catch (err) {
        console.error('Failed to create backend appointment:', err);
        // continue saving locally
      }
      
      // If editing an existing appointment, patch its time on backend
      if (mode === 'edit' && (initial?.backendAppointmentId || backendAppointmentId)) {
        try {
          const scheduledTimeISO = computeScheduledTimeIso(currentDate, startIdx);
          const appointmentDate = formatYmd(currentDate);
          const idToPatch = initial?.backendAppointmentId || backendAppointmentId;
          const patched = await patchBackendAppointment(idToPatch, { scheduled_time: scheduledTimeISO, appointment_date: appointmentDate });
          console.log('Patched backend appointment:', patched);
          backendAppointmentId = idToPatch;
        } catch (err) {
          console.error('Failed to patch backend appointment:', err);
        }
      }

      onSave({
        id: initial?.id,
        doctor,
        request,
        resource: room,
        startIndex: startIdx,
        durationSlots,
        label: labelBase,
        notes,
        services: servicesAdded,
        guestPhone: mobile,
        guestFirstName: first,
        guestLastName: last,
        guestEmail: email,
        guestGender: gender,
        referral,
        isMinor,
        guestId,
        // Additional guest fields
        guestMiddleName: middle,
        dateOfBirth,
        nationality,
        language,
        homeNo,
        username,
        backendAppointmentId: initial?.backendAppointmentId || backendAppointmentId
      });
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsCreatingGuest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[92vw] max-w-[1200px] max-h-[90vh] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 px-4 py-2 bg-blue-50">
          <div className="font-semibold">{mode === 'edit' ? 'Edit Appointment' : 'New Appointment'}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Repeat</button>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={() => setTab('service')}>Add Note</button>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={() => setTab('service')}>Take Payment</button>
            {mode === 'edit' && onDelete && (
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => onDelete(initial)}>Delete</button>
            )}
            <button 
              className={`px-3 py-1 rounded ${isCreatingGuest ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white'}`} 
              onClick={doSave}
              disabled={isCreatingGuest}
            >
              {isCreatingGuest ? 'Creating...' : 'Save'}
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>X</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto grid grid-cols-12 gap-4 p-4">
          {/* Guest column */}
          <div className="col-span-3 border border-gray-200 rounded p-3">
            <div className="text-sm font-semibold mb-3">Guest</div>
            <div className="space-y-2 text-sm">
              <div>
                <label className="block text-gray-600">Username</label>
                <input className="w-full border rounded px-2 py-1" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Auto-generated if empty" />
              </div>
              <div>
                <label className="block text-gray-600">Mobile</label>
                <input className="w-full border rounded px-2 py-1" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Home Phone</label>
                <input className="w-full border rounded px-2 py-1" value={homeNo} onChange={(e) => setHomeNo(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">First Name</label>
                <input className="w-full border rounded px-2 py-1" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Middle Name</label>
                <input className="w-full border rounded px-2 py-1" value={middle} onChange={(e) => setMiddle(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Last Name</label>
                <input className="w-full border rounded px-2 py-1" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <input className="w-full border rounded px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Date of Birth</label>
                <input type="date" className="w-full border rounded px-2 py-1" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Gender</label>
                <select className="w-full border rounded px-2 py-1" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Nationality</label>
                <select className="w-full border rounded px-2 py-1" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Australian">Australian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Language</label>
                <select className="w-full border rounded px-2 py-1" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Referral</label>
                <input className="w-full border rounded px-2 py-1" value={referral} onChange={(e) => setReferral(e.target.value)} />
              </div>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} /> <span>Guest is a minor</span></label>
            </div>
          </div>

          {/* Appointment details */}
          <div className="col-span-9 border border-gray-200 rounded p-3">
            <div className="mb-3">
              <div className="flex items-center gap-6 border-b border-gray-200 mb-3">
                <button className={`pb-2 text-sm font-medium border-b-2 ${tab==='service'?'border-blue-600 text-blue-700':'border-transparent text-gray-600'}`} onClick={()=>setTab('service')}>Service</button>
                <button className={`pb-2 text-sm font-medium border-b-2 ${tab==='package'?'border-blue-600 text-blue-700':'border-transparent text-gray-600'}`} onClick={()=>setTab('package')}>Package</button>
              </div>
              {tab === 'service' ? (
                <select className="w-80 border rounded px-2 py-1" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} - ₹{s.price} ({s.duration} mins)
                    </option>
                  ))}
                </select>
              ) : (
                <input className="w-80 border rounded px-2 py-1" placeholder="Package" />
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <label className="block text-gray-600">Request</label>
                <select className="w-full border rounded px-2 py-1" value={request} onChange={(e) => setRequest(e.target.value)}>
                  <option>Any</option>
                  <option>Specific</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Choose your Doctor</label>
                <select className="w-full border rounded px-2 py-1" value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                  <option value="">Select</option>
                  {doctors.map((d) => (
                    <option key={d.id || d} value={d.name || d}>{d.name || d} {d.specialization ? `(${d.specialization})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Start</label>
                <select className="w-full border rounded px-2 py-1" value={startIdx} onChange={(e) => setStartIdx(parseInt(e.target.value, 10))}>
                  {timeOptions(totalSlots, startHour, slotMinutes).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Duration</label>
                <select className="w-full border rounded px-2 py-1" value={durationSlots} onChange={(e) => setDurationSlots(parseInt(e.target.value, 10))}>
                  <option value={1}>15 mins</option>
                  <option value={2}>30 mins</option>
                  <option value={3}>45 mins</option>
                  <option value={4}>60 mins</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">End</label>
                <input readOnly className="w-full border rounded px-2 py-1 bg-gray-50" value={indexToTime(endIdx, startHour, slotMinutes)} />
              </div>
              <div>
                <label className="block text-gray-600">Room</label>
                <select className="w-full border rounded px-2 py-1" value={room} onChange={(e) => setRoom(e.target.value)}>
                  {rooms.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Notes</div>
              <textarea className="w-full border rounded px-2 py-1" rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Add any notes" />
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Take Payment</div>
              <div className="flex items-center gap-2 text-sm">
                <input className="w-32 border rounded px-2 py-1" placeholder="Amount" />
                <select className="w-40 border rounded px-2 py-1">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                </select>
                <button className="px-3 py-2 bg-green-600 text-white rounded">Collect</button>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  const found = services.find((s) => s.name === selectedService);
                  if (!found) return;
                  
                  setServicesAdded((prev) => [
                    ...prev,
                    {
                      serviceName: selectedService,
                      serviceId: found.id,
                      request,
                      doctor,
                      price: found.price,
                      room,
                      duration: found.duration,
                      description: found.description,
                      category: found.category,
                      start: indexToTime(startIdx, startHour, slotMinutes),
                      durationLabel: `${found.duration} mins`,
                      end: indexToTime(startIdx + Math.ceil(found.duration / slotMinutes), startHour, slotMinutes)
                    }
                  ]);
                }}
              >
                {mode === 'edit' ? 'Save Changes' : 'Add Service'}
              </button>
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
            </div>

            {/* Services list */}
            {servicesAdded.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-10 gap-2 text-xs font-semibold text-gray-700 border-b pb-2">
                  <div className="col-span-3">Service</div>
                  <div>Request</div>
                  <div>Doctor</div>
                  <div>Price</div>
                  <div>Room</div>
                  <div>Duration</div>
                  <div>Start</div>
                  <div>End</div>
                  <div>Category</div>
                </div>
                {servicesAdded.map((s, idx) => (
                  <div key={`${s.serviceName}-${idx}`} className="grid grid-cols-10 gap-2 items-center text-xs py-2 border-b">
                    <div className="col-span-3 overflow-hidden text-ellipsis">{s.serviceName}</div>
                    <div>{s.request}</div>
                    <div>{s.doctor || '-'}</div>
                    <div>₹{s.price.toFixed(2)}</div>
                    <div>{s.room}</div>
                    <div>{s.duration} mins</div>
                    <div>{s.start}</div>
                    <div>{s.end}</div>
                    <div>{s.category || '-'}</div>
                  </div>
                ))}
                <div className="flex justify-end mt-3 text-sm">
                  <div className="font-semibold">Total&nbsp;</div>
                  <div className="font-semibold text-red-600">{servicesAdded.reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



// Named export: BlockoutDialog
export function BlockoutDialog({
  open,
  onClose,
  onSave,
  startIndex = 0,
  resource = '',
  startHour = 9,
  endHour = 20,
  slotMinutes = 15,
  reasons = [
    'Doctor in Service',
    'Doctor Unassigned',
    'Doctors Study Time',
    'Maintenance',
    'Meeting',
    'No Doctor',
    'No Therapist',
    'Training'
  ]
}) {
  if (!open) return null;

  const totalSlots = useMemo(() => ((endHour - startHour) * 60) / slotMinutes, [endHour, startHour, slotMinutes]);
  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [durationSlots, setDurationSlots] = useState(4);
  const [startIdx, setStartIdx] = useState(startIndex);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setStartIdx(startIndex);
  }, [startIndex]);

  const endIdx = Math.min(totalSlots, startIdx + durationSlots);

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[640px] max-w-[95vw] max-h-[85vh] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 bg-blue-50">
          <div className="font-semibold">Block Out Time</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => onSave({ reason: selectedReason, startIndex: startIdx, durationSlots, resource, notes })}>Save</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>X</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 grid grid-cols-1 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Reason</div>
            <div className="border border-gray-200 rounded divide-y">
              {reasons.map((r) => (
                <label key={r} className={`flex items-center justify-between px-3 py-2 cursor-pointer ${selectedReason === r ? 'bg-blue-50' : ''}`}>
                  <span className="text-sm text-gray-800">{r}</span>
                  <input type="radio" name="block-reason" className="ml-3" checked={selectedReason === r} onChange={() => setSelectedReason(r)} />
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <label className="block text-gray-600">Start</label>
              <select className="w-full border rounded px-2 py-1" value={startIdx} onChange={(e) => setStartIdx(parseInt(e.target.value, 10))}>
                {timeOptions(totalSlots, startHour, slotMinutes).map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600">Duration</label>
              <select className="w-full border rounded px-2 py-1" value={durationSlots} onChange={(e) => setDurationSlots(parseInt(e.target.value, 10))}>
                <option value={1}>15 mins</option>
                <option value={2}>30 mins</option>
                <option value={3}>45 mins</option>
                <option value={4}>60 mins</option>
                <option value={8}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600">End</label>
              <input readOnly className="w-full border rounded px-2 py-1 bg-gray-50" value={indexToTime(endIdx, startHour, slotMinutes)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="w-full border rounded px-2 py-1 text-sm" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </div>
        </div>
      </div>
    </div>
  );
}

