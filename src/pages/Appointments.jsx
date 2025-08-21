import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Layouts/sidebar';
import AppointmentHeader from '../components/Apponintments/appointment_header';
import BookingSlots from '../components/Apponintments/booking_slots';
import AppointmentDialog, { BlockoutDialog } from '../components/Apponintments/appointment_dialog';

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

  const rooms = [
    'Con1 Dr Meghana Komsani & Dr Anush',
    'Con2 Dr Sanjita Tripathy',
    'Cons 3 - Dr Pragathi Chadalavada',
    'Dr Led, Peel',
    'Helios - LT Qswitch',
    'LHR - Soprano',
    'LHR - Soprano Ice',
    'Nutritionist',
    'Peels, OFR, OSF',
    'PIXEL'
  ];

  const doctors = [
    'Dr Meghana',
    'Dr Sanjita',
    'Dr Pragathi',
    'Dr Led Team',
    'Helios Team',
    'Soprano Team',
    'Soprano Ice Team',
    'Nutritionist',
    'Peels Team',
    'Pixel Team'
  ];

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
    {
      id: 'a1',
      resource: rooms[0],
      startIndex: 5, // 9:00 + 5*15 = 10:15
      durationSlots: 4,
      label: 'Doctor Unassigned',
      color: 'bg-teal-200 text-teal-900',
      createdBy: 'Admin'
    },
    {
      id: 'a2',
      resource: rooms[0],
      startIndex: 20, // ~2 PM
      durationSlots: 2,
      label: 'New',
      color: 'bg-amber-200 text-amber-900',
      createdBy: 'Admin'
    },
    {
      id: 'a3',
      resource: rooms[2],
      startIndex: 4,
      durationSlots: 36, // long block "No Doctor"
      label: 'No Doctor',
      color: 'bg-blue-800 text-white',
      createdBy: 'Admin'
    },
    {
      id: 'a4',
      resource: rooms[4],
      startIndex: 12,
      durationSlots: 6,
      label: 'Komal Sahu (+91 94 14 010571)',
      color: 'bg-green-200 text-green-900',
      createdBy: 'Admin'
    },
    {
      id: 'a5',
      resource: rooms[5],
      startIndex: 20,
      durationSlots: 16,
      label: 'VarshaG. (+91 8464 840 423)',
      color: 'bg-green-200 text-green-900',
      createdBy: 'Admin'
    },
    {
      id: 'a6',
      resource: rooms[5],
      startIndex: 14,
      durationSlots: 8,
      label: 'Rashmi. (+91 8595 116 529)',
      color: 'bg-green-200 text-green-900',
      createdBy: 'Admin'
    },
    {
      id: 'a7',
      resource: rooms[8],
      startIndex: 8,
      durationSlots: 4,
      label: 'Vinita K',
      color: 'bg-green-200 text-green-900',
      createdBy: 'Admin'
    }
  ];
  });

  const resources = activeTab === 'rooms' ? rooms : doctors;

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
    setAppointments((prev) => prev.map((a) => a.id === appointmentId ? { ...a, resource, startIndex: nextStart } : a));
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

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
      />

      {/* Body with spacing under fixed header */}
      <div className="pt-[104px] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Scheduler Content */}
        <div className="flex-1 p-4">
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
                createdBy: 'Admin'
              }
            ]);
          }
          setDialogState({ open: false, index: 0, resource: null, mode: 'create', appt: null });
        }}
        startIndex={dialogState.index}
        resource={dialogState.resource}
        rooms={rooms}
        doctors={doctors}
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
