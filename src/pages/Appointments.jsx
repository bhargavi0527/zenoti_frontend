import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Layouts/sidebar';
import AppointmentHeader from '../components/Apponintments/appointment_header';
import BookingSlots from '../components/Apponintments/booking_slots';
import AppointmentDialog, { BlockoutDialog } from '../components/Apponintments/appointment_dialog';

// Fetch doctors/providers from API
async function fetchDoctors() {
  try {
    const response = await fetch('http://127.0.0.1:8000/providers/', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const doctors = await response.json();
    return doctors.map(doctor => ({
      id: doctor.id,
      name: `${doctor.first_name} ${doctor.last_name}`,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      center_id: doctor.center_id
    }));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

// Fetch services from API
async function fetchServices() {
  try {
    const response = await fetch('http://127.0.0.1:8000/services/', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const services = await response.json();
    return services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Fetch rooms from API
async function fetchRooms() {
  try {
    const response = await fetch('http://127.0.0.1:8000/rooms/', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rooms = await response.json();
    return rooms.map(room => ({
      id: room.id,
      code: room.code,
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      only_one_appointment: room.only_one_appointment,
      can_exceed_capacity: room.can_exceed_capacity,
      center_id: room.center_id,
      is_active: room.is_active,
      room_category_id: room.room_category_id,
      dq_check_remark: room.dq_check_remark
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

function Appointments() {
  const START_HOUR = 9;
  const END_HOUR = 20; // 8 PM
  const SLOT_MINUTES = 15;
  const totalSlots = useMemo(() => ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES, []);

  const hourLabels = useMemo(() => {
    const labels = [];
    for (let h = START_HOUR; h <= END_HOUR; h += 1) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const suffix = h < 12 ? 'AM' : 'PM';
      labels.push(`${hour} ${suffix}`);
    }
    return labels;
  }, []);

  const minuteLabels = useMemo(() => {
    const labels = [];
    for (let h = START_HOUR; h < END_HOUR; h += 1) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        labels.push(`${h}:${m.toString().padStart(2, '0')}`);
      }
    }
    return labels;
  }, []);

  // State for rooms with loading and error handling
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);

  // State for doctors with loading and error handling
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);

  // State for services with loading and error handling
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  // State for centers with loading and error handling
  const [centers, setCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(true);
  const [centersError, setCentersError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Fetch doctors, services, centers, and rooms on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load doctors
      setDoctorsLoading(true);
      setDoctorsError(null);
      try {
        const fetchedDoctors = await fetchDoctors();
        setDoctors(fetchedDoctors);
      } catch (error) {
        console.error('Failed to load doctors:', error);
        setDoctorsError('Failed to load doctors');
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }

      // Load services
      setServicesLoading(true);
      setServicesError(null);
      try {
        const fetchedServices = await fetchServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Failed to load services:', error);
        setServicesError('Failed to load services');
        setServices([]);
      } finally {
        setServicesLoading(false);
      }

      // Load rooms
      setRoomsLoading(true);
      setRoomsError(null);
      try {
        const fetchedRooms = await fetchRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Failed to load rooms:', error);
        setRoomsError('Failed to load rooms');
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }

      // Load centers
      setCentersLoading(true);
      setCentersError(null);
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

        const fetchedCenters = await response.json();
        setCenters(fetchedCenters);
        
        // Set default selected center
        if (fetchedCenters.length > 0) {
          setSelectedCenter(fetchedCenters[0]);
        }
      } catch (error) {
        console.error('Failed to load centers:', error);
        setCentersError('Failed to load centers');
        setCenters([]);
      } finally {
        setCentersLoading(false);
      }
    };

    loadData();
  }, []);

  // Get doctor names for the booking slots (compatibility with existing code)
  const doctorNames = useMemo(() => doctors.map(d => d.name), [doctors]);

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'doctors'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trainingCenter, setTrainingCenter] = useState('Corporate Training Center');
  const [orientation, setOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [dialogState, setDialogState] = useState({ open: false, index: 0, resource: null, mode: 'create', appt: null });
  const [blockoutState, setBlockoutState] = useState({ open: false, index: 0, resource: null });

  const storageKeyForDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `appointments_by_date:${yyyy}-${mm}-${dd}`;
  };

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(storageKeyForDate(currentDate));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [
    // {
    //   id: 'a1',
    //   resource: 'Consultation Room 1',
    //   startIndex: 5, // 9:00 + 5*15 = 10:15
    //   durationSlots: 4,
    //   label: 'Doctor Unassigned',
    //   color: 'bg-teal-200 text-teal-900',
    //   createdBy: 'Admin'
    // },
    // {
    //   id: 'a2',
    //   resource: 'Consultation Room 1',
    //   startIndex: 20, // ~2 PM
    //   durationSlots: 2,
    //   label: 'New',
    //   color: 'bg-amber-200 text-amber-900',
    //   createdBy: 'Admin'
    // },
    // {
    //   id: 'a3',
    //   resource: 'Treatment Room',
    //   startIndex: 4,
    //   durationSlots: 36, // long block "No Doctor"
    //   label: 'No Doctor',
    //   color: 'bg-blue-800 text-white',
    //   createdBy: 'Admin'
    // },
    // {
    //   id: 'a4',
    //   resource: 'Physiotherapy Room',
    //   startIndex: 12,
    //   durationSlots: 6,
    //   label: 'Komal Sahu (+91 94 14 010571)',
    //   color: 'bg-green-200 text-green-900',
    //   createdBy: 'Admin'
    // },
    // {
    //   id: 'a5',
    //   resource: 'Counseling Room',
    //   startIndex: 20,
    //   durationSlots: 16,
    //   label: 'VarshaG. (+91 8464 840 423)',
    //   color: 'bg-green-200 text-green-900',
    //   createdBy: 'Admin'
    // },
    // {
    //   id: 'a6',
    //   resource: 'Counseling Room',
    //   startIndex: 14,
    //   durationSlots: 8,
    //   label: 'Rashmi. (+91 8595 116 529)',
    //   color: 'bg-green-200 text-green-900',
    //   createdBy: 'Admin'
    // },
    // {
    //   id: 'a7',
    //   resource: 'General Consultation Room',
    //   startIndex: 8,
    //   durationSlots: 4,
    //   label: 'Vinita K',
    //   color: 'bg-green-200 text-green-900',
    //   createdBy: 'Admin'
    // }
  ];
  });

  const resources = activeTab === 'rooms' ? rooms.map(room => room.name) : doctors.map(d => d.name);

  // Save when date or appointments change
  useEffect(() => {
    localStorage.setItem(storageKeyForDate(currentDate), JSON.stringify(appointments));
  }, [appointments, currentDate]);

  // Persist appointments when changed
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const getResourceAppointments = (resource) => appointments.filter((a) => a.resource === resource);

  const clampIndex = (index, durationSlotsLocal) => {
    const maxStart = totalSlots - durationSlotsLocal;
    if (index < 0) return 0;
    if (index > maxStart) return maxStart;
    return index;
  };

  // Prevent overlapping bookings on the same resource
  const hasConflict = (resource, startIndex, durationSlots, ignoreId = null) => {
    const newStart = startIndex;
    const newEnd = startIndex + durationSlots;
    return appointments.some((a) => {
      if (a.resource !== resource) return false;
      if (ignoreId && a.id === ignoreId) return false;
      const aStart = a.startIndex;
      const aEnd = a.startIndex + a.durationSlots;
      return newStart < aEnd && aStart < newEnd;
    });
  };

  const handleDropOnCell = (appointmentId, resource, targetIndex) => {
    // Confirm reschedule before applying
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt) return;
    const nextStart = clampIndex(targetIndex, appt.durationSlots);
    if (hasConflict(resource, nextStart, appt.durationSlots, appointmentId)) {
      // Silently ignore conflicting move
      return;
    }
    if (appt.resource === resource && appt.startIndex === nextStart) return;
    // Update local state immediately
    setAppointments((prev) => prev.map((a) => a.id === appointmentId ? { ...a, resource, startIndex: nextStart } : a));

    // If appointment has backend id, patch its scheduled_time
    const minutesFromStart = START_HOUR * 60 + nextStart * SLOT_MINUTES;
    const hours24 = Math.floor(minutesFromStart / 60);
    const minutes = minutesFromStart % 60;
    const scheduledDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours24, minutes, 0);
    const scheduledISO = scheduledDate.toISOString();
    if (appt.backendAppointmentId) {
      fetch(`http://127.0.0.1:8000/appointments/${appt.backendAppointmentId}`, {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scheduled_time: scheduledISO })
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('Patched appointment scheduled_time:', data);
      }).catch((err) => {
        console.error('Failed to patch appointment time:', err);
      });
    }
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Helper: format date to YYYY-MM-DD
  const formatYmd = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper: compute startIndex from ISO time
  const getStartIndexFromIso = (iso) => {
    try {
      const dt = new Date(iso);
      const minutes = dt.getHours() * 60 + dt.getMinutes();
      const startMinutes = START_HOUR * 60;
      const diff = Math.max(0, minutes - startMinutes);
      return Math.floor(diff / SLOT_MINUTES);
    } catch {
      return 0;
    }
  };

  // Fetch backend appointments for currentDate and map onto grid by time
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // Start from locally saved appointments for the selected day
        const savedRaw = localStorage.getItem(storageKeyForDate(currentDate));
        let localForDay = [];
        if (savedRaw) {
          try {
            const parsed = JSON.parse(savedRaw);
            if (Array.isArray(parsed)) localForDay = parsed;
          } catch {}
        }

        const res = await fetch('http://127.0.0.1:8000/appointments/', {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const all = await res.json();
        const dayStr = formatYmd(currentDate);
        const filtered = Array.isArray(all) ? all.filter(a => a.appointment_date === dayStr) : [];
        const backendAppts = filtered.map(a => {
          const provider = doctors.find(d => d.id === a.provider_id);
          const service = services.find(s => s.id === a.service_id);
          return {
            id: a.id,
            resource: activeTab === 'doctors' ? (provider?.name || 'Unknown Doctor') : (provider?.name || 'Unknown'),
            startIndex: getStartIndexFromIso(a.scheduled_time),
            durationSlots: 4,
            label: service?.name || 'Appointment',
            color: 'bg-green-200 text-green-900',
            doctor: provider?.name || '',
            services: service ? [{ serviceName: service.name, serviceId: service.id }] : [],
            createdBy: 'System',
            backendAppointmentId: a.id
          };
        });

        // Merge: backend wins by same id; keep local-only (e.g., "new-..." items)
        const byId = new Map();
        localForDay.forEach(item => byId.set(item.id, item));
        backendAppts.forEach(item => byId.set(item.id, item));
        const merged = Array.from(byId.values());
        setAppointments(merged);
      } catch (err) {
        console.error('Failed to load appointments:', err);
        // On failure, fall back to locally saved data (if any)
        const savedRaw = localStorage.getItem(storageKeyForDate(currentDate));
        if (savedRaw) {
          try {
            const parsed = JSON.parse(savedRaw);
            if (Array.isArray(parsed)) setAppointments(parsed);
          } catch {}
        }
      }
    };

    // Only run after doctors and services have loaded
    if (doctors.length > 0 || services.length > 0) {
      loadAppointments();
    }
  }, [currentDate, doctors, services]);

  const renderRow = (resource) => {
    return (
      <div key={resource} className="flex border-b border-gray-200">
        {/* Resource name */}
        <div className="w-56 px-3 py-3 text-sm text-gray-800 bg-white sticky left-0 z-10 border-r border-gray-200">
          {resource}
        </div>
        {/* Timeline */}
        <div className="relative flex-1 bg-white">
          {/* Background grid cells and drop zones */}
          <div className="grid" style={{ gridTemplateColumns: `repeat(${totalSlots}, minmax(40px, 1fr))` }}>
            {Array.from({ length: totalSlots }).map((_, idx) => (
              <div
                key={idx}
                onDragOver={onDragOver}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) handleDropOnCell(id, resource, idx);
                }}
                className={`h-16 border-l border-gray-100 ${idx % 4 === 0 ? 'bg-gray-50' : ''}`}
              />
            ))}
          </div>

          {/* Appointments layer */}
          <div className="absolute inset-0">
            {getResourceAppointments(resource).map((a) => {
              const leftPct = (a.startIndex / totalSlots) * 100;
              const widthPct = (a.durationSlots / totalSlots) * 100;
              return (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, a.id)}
                  className={`absolute top-2 ${a.color} rounded-md shadow cursor-move text-xs px-3 py-2 overflow-hidden`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  title={`${a.label}`}
                >
                  {a.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed full-bleed header */}
      <AppointmentHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentDate={currentDate}
        onPrevDate={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))}
        onNextDate={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))}
        fullBleedFixed
        selectedTrainingCenter={trainingCenter}
        onTrainingCenterChange={setTrainingCenter}
        orientation={orientation}
        onOrientationChange={setOrientation}
        selectedCenter={selectedCenter}
        onGuestCreated={(guest) => {
          console.log('New guest created:', guest);
          // You can add additional logic here, such as refreshing the guest list
          // or showing a success notification
        }}
      />

      {/* Body with spacing under fixed header */}
      <div className="pt-[104px] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Scheduler Content */}
        <div className="flex-1 p-4">
            {(doctorsLoading || servicesLoading || centersLoading || roomsLoading) ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading data...</p>
                </div>
              </div>
            ) : (doctorsError || servicesError || centersError || roomsError) ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  {doctorsError && <p className="text-red-600 mb-2">{doctorsError}</p>}
                  {servicesError && <p className="text-red-600 mb-2">{servicesError}</p>}
                  {centersError && <p className="text-red-600 mb-2">{centersError}</p>}
                  {roomsError && <p className="text-red-600 mb-2">{roomsError}</p>}
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
            <BookingSlots
              startHour={START_HOUR}
              endHour={END_HOUR}
              slotMinutes={SLOT_MINUTES}
              currentDate={currentDate}
              activeTab={activeTab}
              orientation={orientation}
              rooms={rooms}
              doctors={doctors}
              appointments={appointments}
              onDropOnCell={(appointmentId, resource, idx) => handleDropOnCell(appointmentId, resource, idx)}
              onDragStart={onDragStart}
              onAppointmentClick={(appt) => {
                setDialogState({ open: true, index: appt.startIndex, resource: appt.resource, mode: 'edit', appt });
              }}
              onCreateAppointment={({ index, resource, durationSlots }) => {
                const apptInit = durationSlots ? { startIndex: index, resource, durationSlots } : null;
                setDialogState({ open: true, index, resource, mode: 'create', appt: apptInit });
              }}
              onCreateGroupAppointment={({ index, resource }) => {
                console.log('Open group appointment dialog', { index, resource });
              }}
              onBlockoutTime={({ index, resource, reason }) => {
                if (reason) {
                  // Quick create directly from submenu
                  if (hasConflict(resource, index, 4)) {
                    alert('Time conflict: this resource already has an appointment in that time.');
                    return;
                  }
                  setAppointments((prev) => [
                    ...prev,
                    {
                      id: `block-${Date.now()}`,
                      resource,
                      startIndex: index,
                      durationSlots: 4,
                      label: reason,
                      color: 'bg-blue-800 text-white',
                      createdBy: 'Admin'
                    }
                  ]);
                } else {
                  setBlockoutState({ open: true, index, resource });
                }
              }}
              onEditAppointment={(appt) => setDialogState({ open: true, index: appt.startIndex, resource: appt.resource, mode: 'edit', appt })}
              onDeleteAppointment={(appt) => setAppointments((prev) => prev.filter((a) => a.id !== appt.id))}
            />
            )}
          </div>
      <AppointmentDialog
        open={dialogState.open}
        onClose={() => setDialogState({ open: false, index: 0, resource: null, mode: 'create', appt: null })}
        onSave={(payload) => {
          if (dialogState.mode === 'edit' && payload.id) {
            if (hasConflict(payload.resource, payload.startIndex, payload.durationSlots, payload.id)) {
              alert('Time conflict: this resource already has an appointment in that time.');
              return;
            }
            setAppointments((prev) => prev.map((a) => a.id === payload.id ? { ...a, ...payload } : a));
          } else {
            if (hasConflict(payload.resource, payload.startIndex, payload.durationSlots)) {
              alert('Time conflict: this resource already has an appointment in that time.');
              return;
            }
            setAppointments((prev) => [
              ...prev,
              {
                id: `new-${Date.now()}`,
                resource: payload.resource,
                startIndex: payload.startIndex,
                durationSlots: payload.durationSlots,
                label: payload.label,
                color: 'bg-green-200 text-green-900',
                doctor: payload.doctor,
                request: payload.request,
                notes: payload.notes,
                services: payload.services || [],
                guestPhone: payload.guestPhone,
                guestFirstName: payload.guestFirstName,
                guestLastName: payload.guestLastName,
                guestEmail: payload.guestEmail,
                guestGender: payload.guestGender,
                referral: payload.referral,
                isMinor: payload.isMinor,
                createdBy: 'Admin',
                backendAppointmentId: payload.backendAppointmentId || null
              }
            ]);
          }
          setDialogState({ open: false, index: 0, resource: null, mode: 'create', appt: null });
        }}
        startIndex={dialogState.index}
        resource={dialogState.resource}
        rooms={rooms.map(room => room.name)}
        doctors={doctors}
        services={services}
        selectedCenter={selectedCenter}
        currentDate={currentDate}
        startHour={START_HOUR}
        endHour={END_HOUR}
        slotMinutes={SLOT_MINUTES}
        mode={dialogState.mode}
        initial={dialogState.appt}
        onDelete={(appt) => {
          setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
          setDialogState({ open: false, index: 0, resource: null, mode: 'create', appt: null });
        }}
      />

      <BlockoutDialog
        open={blockoutState.open}
        onClose={() => setBlockoutState({ open: false, index: 0, resource: null })}
        onSave={(payload) => {
          // Save a blockout as a special appointment with a label
          if (hasConflict(blockoutState.resource, payload.startIndex, payload.durationSlots)) {
            alert('Time conflict: this resource already has an appointment in that time.');
            return;
          }
          setAppointments((prev) => [
            ...prev,
            {
              id: `block-${Date.now()}`,
              resource: blockoutState.resource,
              startIndex: payload.startIndex,
              durationSlots: payload.durationSlots,
              label: payload.reason,
              color: 'bg-blue-800 text-white',
              createdBy: 'Admin',
              notes: payload.notes
            }
          ]);
          setBlockoutState({ open: false, index: 0, resource: null });
        }}
        startIndex={blockoutState.index}
        resource={blockoutState.resource}
        startHour={START_HOUR}
        endHour={END_HOUR}
        slotMinutes={SLOT_MINUTES}
      />
        </div>
      </div>
    </div>
  );
}

export default Appointments;
