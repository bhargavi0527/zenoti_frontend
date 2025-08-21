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

export default function AppointmentDialog({
  open,
  onClose,
  onSave,
  startIndex,
  resource,
  rooms = [],
  doctors = [],
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
  const [last, setLast] = useState(initial?.guestLastName || '');
  const [email, setEmail] = useState(initial?.guestEmail || '');
  const [gender, setGender] = useState(initial?.guestGender || '');
  const [referral, setReferral] = useState(initial?.referral || '');
  const [isMinor, setIsMinor] = useState(initial?.isMinor || false);

  // Appointment fields
  const [request, setRequest] = useState(initial?.request || 'Any');
  const [doctor, setDoctor] = useState(initial?.doctor || '');
  const [room, setRoom] = useState(initial?.resource || resource || rooms[0] || '');
  const [durationSlots, setDurationSlots] = useState(initial?.durationSlots || 1);
  const [startIdx, setStartIdx] = useState(initial?.startIndex ?? startIndex ?? 0);
  const [notes, setNotes] = useState(initial?.notes || '');
  const [tab, setTab] = useState('service'); // 'service' | 'package'

  // Simple dummy catalog for services
  const serviceCatalog = [
    { name: '17-OH Progesterone (OH-PROGESTERONE) EY', price: 800, equipment: 'N/A' },
    { name: 'Thyroid Profile', price: 600, equipment: 'N/A' },
    { name: 'Vitamin D Test', price: 900, equipment: 'N/A' }
  ];
  const [selectedService, setSelectedService] = useState(serviceCatalog[0]?.name || '');
  const [servicesAdded, setServicesAdded] = useState(initial?.services || []);

  useEffect(() => {
    setStartIdx(initial?.startIndex ?? startIndex ?? 0);
    setRoom(initial?.resource || resource || rooms[0] || '');
    if (initial?.durationSlots) setDurationSlots(initial.durationSlots);
  }, [startIndex, resource, rooms, initial]);

  const endIdx = Math.min(totalSlots, startIdx + durationSlots);

  const doSave = () => {
    const labelBase = (servicesAdded[0]?.serviceName)
      || (first || last ? `${first} ${last}`.trim() : (initial?.label || 'New Appointment'));
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
      isMinor
    });
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
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={doSave}>Save</button>
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
                <label className="block text-gray-600">Mobile</label>
                <input className="w-full border rounded px-2 py-1" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">First</label>
                <input className="w-full border rounded px-2 py-1" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Last</label>
                <input className="w-full border rounded px-2 py-1" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <input className="w-full border rounded px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-600">Gender</label>
                <select className="w-full border rounded px-2 py-1" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
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
                  {serviceCatalog.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
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
                    <option key={d} value={d}>{d}</option>
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
                  const found = serviceCatalog.find((s) => s.name === selectedService) || { price: 0, equipment: 'N/A' };
                  setServicesAdded((prev) => [
                    ...prev,
                    {
                      serviceName: selectedService,
                      request,
                      doctor,
                      price: found.price,
                      room,
                      equipment: found.equipment,
                      start: indexToTime(startIdx, startHour, slotMinutes),
                      durationLabel: `${durationSlots * slotMinutes} mins`,
                      end: indexToTime(endIdx, startHour, slotMinutes)
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
                  <div>Choose Your D</div>
                  <div>Price</div>
                  <div>Room</div>
                  <div>Equipment</div>
                  <div>Start</div>
                  <div>Duration</div>
                  <div>End</div>
                </div>
                {servicesAdded.map((s, idx) => (
                  <div key={`${s.serviceName}-${idx}`} className="grid grid-cols-10 gap-2 items-center text-xs py-2 border-b">
                    <div className="col-span-3 overflow-hidden text-ellipsis">{s.serviceName}</div>
                    <div>{s.request}</div>
                    <div>{s.doctor || '-'}</div>
                    <div>{s.price.toFixed(2)}</div>
                    <div>{s.room}</div>
                    <div>{s.equipment}</div>
                    <div>{s.start}</div>
                    <div>{s.durationLabel}</div>
                    <div>{s.end}</div>
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

