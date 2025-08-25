import React, { useMemo, useState, useEffect, useRef } from 'react';

/**
 * BookingSlots
 * Renders the time grid with resources on the left and 15-min slots across the day.
 * Keeps layout identical to what Appointments.jsx had, but extracted to a component.
 */
export default function BookingSlots({
  startHour = 9,
  endHour = 20,
  slotMinutes = 15,
  currentDate = new Date(),
  orientation = 'horizontal',
  activeTab = 'rooms',
  rooms = [],
  doctors = [],
  appointments = [],
  onDropOnCell = () => {},
  onDragStart = () => {},
  onCreateAppointment = () => {},
  onCreateGroupAppointment = () => {},
  onBlockoutTime = () => {},
  onAppointmentClick = () => {},
  onEditAppointment = () => {},
  onDeleteAppointment = () => {}
}) {
  const totalSlots = useMemo(() => ((endHour - startHour) * 60) / slotMinutes, [endHour, startHour, slotMinutes]);

  const hourLabels = useMemo(() => {
    const labels = [];
    for (let h = startHour; h <= endHour; h += 1) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const suffix = h < 12 ? 'AM' : 'PM';
      labels.push(`${hour} ${suffix}`);
    }
    return labels;
  }, [startHour, endHour]);

  const minuteLabels = useMemo(() => {
    const labels = [];
    for (let h = startHour; h < endHour; h += 1) {
      for (let m = 0; m < 60; m += slotMinutes) {
        labels.push(`${h}:${m.toString().padStart(2, '0')}`);
      }
    }
    return labels;
  }, [startHour, endHour, slotMinutes]);

  const resources = activeTab === 'rooms' ? rooms.map(room => room.name) : doctors.map(d => d.name || d);
  const getResourceAppointments = (resource) => appointments.filter((a) => a.resource === resource);

  const onDragOver = (e) => e.preventDefault();

  // Context menu state
  const [menu, setMenu] = useState({ open: false, x: 0, y: 0, index: null, resource: null });
  const [blockMenu, setBlockMenu] = useState({ open: false, x: 0, y: 0 });
  const blockReasons = [
    'Doctor in Service',
    'Doctor Unassigned',
    'Doctors Study Time',
    'Maintenance',
    'Meeting',
    'No Doctor',
    'No Therapist',
    'Training'
  ];
  const [infoApptId, setInfoApptId] = useState(null);
  const [pinnedInfoId, setPinnedInfoId] = useState(null);
  const [selection, setSelection] = useState({ active: false, resource: null, startIdx: null, currentIdx: null });
  const popRef = useRef(null);
  const [popoverAlign, setPopoverAlign] = useState('center'); // 'left' | 'center' | 'right'
  const [popoverSide, setPopoverSide] = useState('above'); // 'above' | 'below'

  // Close pinned popover on outside click or ESC
  useEffect(() => {
    if (!pinnedInfoId) return undefined;
    const onDocClick = (e) => {
      const target = e.target;
      if (!target.closest || !target.closest('[data-appt-id]')) {
        setPinnedInfoId(null);
        setInfoApptId(null);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setPinnedInfoId(null);
        setInfoApptId(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [pinnedInfoId]);

  // Reposition popover to avoid clipping
  useEffect(() => {
    const reposition = () => {
      const el = popRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const margin = 8;
      let align = 'center';
      if (rect.right > window.innerWidth - margin) align = 'right';
      else if (rect.left < margin) align = 'left';
      let side = 'above';
      if (rect.top < margin) side = 'below';
      setPopoverAlign(align);
      setPopoverSide(side);
    };
    if (infoApptId) {
      // wait for DOM paint
      const id = requestAnimationFrame(reposition);
      window.addEventListener('resize', reposition);
      window.addEventListener('scroll', reposition, true);
      return () => {
        cancelAnimationFrame(id);
        window.removeEventListener('resize', reposition);
        window.removeEventListener('scroll', reposition, true);
      };
    }
  }, [infoApptId]);

  const popoverPositionClasses = () => {
    const alignClass = popoverAlign === 'center' ? 'left-1/2 -translate-x-1/2' : popoverAlign === 'left' ? 'left-2' : 'right-2';
    const sideClass = popoverSide === 'above' ? '-translate-y-full -top-2' : 'translate-y-2 top-full';
    return `${alignClass} ${sideClass}`;
  };


  const indexToLabel = (idx) => {
    const totalMinutes = startHour * 60 + idx * slotMinutes;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const suffix = hours24 < 12 ? 'AM' : 'PM';
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${suffix}`;
  };

  const openMenuAt = (clientX, clientY, idx, resource) => {
    const menuWidth = 224; // ~w-56
    const menuHeight = 140; // approximate
    const x = Math.min(window.innerWidth - menuWidth - 8, clientX);
    const y = Math.min(window.innerHeight - menuHeight - 8, clientY);
    setMenu({ open: true, x, y, index: idx, resource });
  };
  const closeMenu = () => setMenu({ open: false, x: 0, y: 0, index: null, resource: null });

  // Close on ESC
  useEffect(() => {
    if (!menu.open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu.open]);

  const renderRow = (resource) => {
    // Find room details if this is a room resource
    const roomDetails = activeTab === 'rooms' ? rooms.find(room => room.name === resource) : null;
    
    return (
    <div key={resource} className="flex border-b border-gray-200">
      <div className="w-56 px-3 py-3 text-sm text-gray-800 bg-white sticky left-0 z-10 border-r border-gray-200">
        <div className="font-medium">{resource}</div>
        {roomDetails && (
          <div className="text-xs text-gray-500 mt-1">
            <div>Code: {roomDetails.code}</div>
            <div>Capacity: {roomDetails.capacity}</div>
            {roomDetails.description && (
              <div className="truncate" title={roomDetails.description}>
                {roomDetails.description}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className="relative flex-1 bg-white"
        onContextMenu={(e) => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
          const idx = Math.max(0, Math.min(totalSlots - 1, Math.floor(ratio * totalSlots)));
          openMenuAt(e.clientX, e.clientY, idx, resource);
        }}
        onMouseLeave={() => {
          if (selection.active) setSelection((s) => ({ ...s, currentIdx: s.currentIdx }));
        }}
      >
        <div className="grid select-none" style={{ gridTemplateColumns: `repeat(${totalSlots}, minmax(40px, 1fr))` }}>
          {Array.from({ length: totalSlots }).map((_, idx) => (
            <div
              key={idx}
              onDragOver={onDragOver}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('text/plain');
                if (id) onDropOnCell(id, resource, idx);
              }}
              onMouseDown={(e) => {
                if (e.button !== 0) return; // only left click
                setSelection({ active: true, resource, startIdx: idx, currentIdx: idx });
              }}
              onMouseEnter={() => {
                setSelection((s) => (s.active && s.resource === resource ? { ...s, currentIdx: idx } : s));
              }}
              onMouseUp={() => {
                setSelection((s) => {
                  if (!s.active || s.resource !== resource) return s;
                  const start = Math.min(s.startIdx, s.currentIdx ?? s.startIdx);
                  const end = Math.max(s.startIdx, s.currentIdx ?? s.startIdx);
                  const durationSlotsSel = Math.max(1, end - start + 1);
                  onCreateAppointment({ index: start, resource, durationSlots: durationSlotsSel });
                  return { active: false, resource: null, startIdx: null, currentIdx: null };
                });
              }}
              className={`h-16 border-l border-gray-100 ${idx % 4 === 0 ? 'bg-gray-50' : ''}`}
            />
          ))}
        </div>
        {selection.active && selection.resource === resource && (
          <div className="absolute inset-0 pointer-events-none">
            {(() => {
              const start = Math.min(selection.startIdx ?? 0, selection.currentIdx ?? selection.startIdx ?? 0);
              const end = Math.max(selection.startIdx ?? 0, selection.currentIdx ?? selection.startIdx ?? 0);
              const leftPct = (start / totalSlots) * 100;
              const widthPct = (Math.max(1, end - start + 1) / totalSlots) * 100;
              return (
                <div className="absolute top-2 h-10 bg-blue-200/40 border border-blue-400 rounded" style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
              );
            })()}
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none">
          {getResourceAppointments(resource).map((a) => {
            const leftPct = (a.startIndex / totalSlots) * 100;
            const widthPct = (a.durationSlots / totalSlots) * 100;
            const startLabel = indexToLabel(a.startIndex);
            const endLabel = indexToLabel(Math.min(totalSlots, a.startIndex + a.durationSlots));
            const fullName = `${a.guestFirstName || ''} ${a.guestLastName || ''}`.trim();
            const phone = a.guestPhone || '';
            const serviceName = Array.isArray(a.services) && a.services.length > 0 ? a.services[0].serviceName : '';
            return (
              <div
                key={a.id}
                draggable
                onDragStart={(e) => onDragStart(e, a.id)}
                onClick={(e) => {
                  // Pin popover on click; do not open edit dialog here
                  e.stopPropagation();
                  setPinnedInfoId(a.id);
                  setInfoApptId(a.id);
                  setPopoverAnchor(e.currentTarget.getBoundingClientRect());
                }}
                data-appt-id={a.id}
                className={`absolute top-2 pointer-events-auto ${a.color} rounded-md shadow cursor-move text-xs px-3 py-2`}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                title={`${a.label}`}
                onMouseEnter={() => {
                  if (!pinnedInfoId) setInfoApptId(a.id);
                }}
                onMouseLeave={() => {
                  if (!pinnedInfoId) setInfoApptId((prev) => (prev === a.id ? null : prev));
                }}
              >
                {a.label}

                {infoApptId === a.id && (
                  <div ref={popRef} className={`absolute ${popoverPositionClasses()} bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 w-80 z-[130] pointer-events-auto`}>
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium mb-1">{fullName || a.label}{phone ? ` (${phone})` : ''}</div>
                      <div className="text-xs text-gray-600">Time: {startLabel} - {endLabel}</div>
                      {serviceName && <div className="text-xs text-gray-600">Service: {serviceName}</div>}
                      <div className="text-xs text-gray-600 mt-1">Created By: {a.createdBy || 'Admin'}</div>
                    </div>
                    <div className="flex justify-end gap-2 px-3 pb-2">
                      <button className="text-xs text-blue-600 hover:underline" onClick={(e) => { e.stopPropagation(); onEditAppointment(a); }}>Edit</button>
                      <button className="text-xs text-red-600 hover:underline" onClick={(e) => { e.stopPropagation(); if (confirm('Delete this appointment?')) onDeleteAppointment(a); }}>Delete</button>
                    </div>
                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {orientation === 'horizontal' ? (
        <>
          <div className="flex border-b border-gray-200">
            <div className="w-56 bg-white" />
            <div className="flex-1">
              <div className="grid text-center text-xs text-gray-700" style={{ gridTemplateColumns: `repeat(${endHour - startHour + 1}, minmax(160px, 1fr))` }}>
                {hourLabels.map((h) => (
                  <div key={h} className="py-2 font-semibold">
                    {h}
                  </div>
                ))}
              </div>
              <div className="grid text-[10px] text-gray-400" style={{ gridTemplateColumns: `repeat(${totalSlots}, minmax(40px, 1fr))` }}>
                {minuteLabels.map((m, i) => (
                  <div key={`${m}-${i}`} className="py-1 text-center">
                    {i % 4 === 0 ? `${(startHour + Math.floor(i / 4)) % 12 || 12}:${(i % 4) * 15 === 0 ? '00' : (i % 4) * 15}` : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="max-h-[70vh] overflow-auto">
            {resources.map((res) => renderRow(res))}
          </div>
        </>
      ) : (
        <>
          {/* Vertical: resource headers across top */}
          <div className="flex border-b border-gray-200">
            <div className="w-24 bg-white" />
            <div className="flex-1">
              <div className="grid text-center text-xs text-gray-700" style={{ gridTemplateColumns: `repeat(${resources.length}, minmax(160px, 1fr))` }}>
                {resources.map((r) => (
                  <div key={r} className="py-2 font-semibold">
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="relative max-h-[70vh] overflow-auto">
            {/* Time labels on left */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-white z-10 border-r border-gray-200">
              <div className="grid text-[10px] text-gray-600" style={{ gridTemplateRows: `repeat(${totalSlots}, minmax(40px, 1fr))` }}>
                {Array.from({ length: totalSlots }).map((_, i) => (
                  <div key={i} className="flex items-start justify-end pr-1 pt-1">
                    {i % 4 === 0 ? `${(startHour + Math.floor(i / 4)) % 12 || 12}:${(i % 4) * 15 === 0 ? '00' : (i % 4) * 15}` : ''}
                  </div>
                ))}
              </div>
            </div>
            {/* Grid with drop cells */}
            <div className="ml-24 relative">
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${resources.length}, minmax(160px, 1fr))`, gridTemplateRows: `repeat(${totalSlots}, minmax(40px, 1fr))` }}
              >
                {Array.from({ length: totalSlots * resources.length }).map((_, idx) => {
                  const rowIdx = Math.floor(idx / resources.length);
                  const colIdx = idx % resources.length;
                  const res = resources[colIdx];
                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      onDragOver={onDragOver}
                      onDrop={(e) => {
                        const id = e.dataTransfer.getData('text/plain');
                        if (id) onDropOnCell(id, res, rowIdx);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        openMenuAt(e.clientX, e.clientY, rowIdx, res);
                      }}
                      className={`border-l border-t border-gray-100 ${colIdx === 0 ? '' : ''} ${rowIdx % 4 === 0 ? 'bg-gray-50' : ''}`}
                    />
                  );
                })}
              </div>
              {/* Appointments overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {appointments.map((a) => {
                  const colIdx = resources.indexOf(a.resource);
                  if (colIdx < 0) return null;
                  const topPct = (a.startIndex / totalSlots) * 100;
                  const heightPct = (a.durationSlots / totalSlots) * 100;
                  const leftPct = (colIdx / resources.length) * 100;
                  const widthPct = (1 / resources.length) * 100;
                  const startLabel = indexToLabel(a.startIndex);
                  const endLabel = indexToLabel(Math.min(totalSlots, a.startIndex + a.durationSlots));
                  const fullName = `${a.guestFirstName || ''} ${a.guestLastName || ''}`.trim();
                  const phone = a.guestPhone || '';
                  const serviceName = Array.isArray(a.services) && a.services.length > 0 ? a.services[0].serviceName : '';
                  return (
                    <div
                      key={a.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, a.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinnedInfoId(a.id);
                        setInfoApptId(a.id);
                        setPopoverAnchor(e.currentTarget.getBoundingClientRect());
                      }}
                      data-appt-id={a.id}
                      className={`absolute pointer-events-auto ${a.color} rounded-md shadow cursor-move text-xs px-3 py-2`}
                      style={{ top: `${topPct}%`, height: `${heightPct}%`, left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${a.label}`}
                      onMouseEnter={() => {
                        if (!pinnedInfoId) setInfoApptId(a.id);
                      }}
                      onMouseLeave={() => {
                        if (!pinnedInfoId) setInfoApptId((prev) => (prev === a.id ? null : prev));
                      }}
                    >
                      {a.label}
                      {infoApptId === a.id && (
                        <div ref={popRef} className={`absolute ${popoverPositionClasses()} bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 w-80 z-[130] pointer-events-auto`} style={{ top: 0 }}>
                          <div className="px-3 py-2 text-sm">
                            <div className="font-medium mb-1">{fullName || a.label}{phone ? ` (${phone})` : ''}</div>
                            <div className="text-xs text-gray-600">Time: {startLabel} - {endLabel}</div>
                            {serviceName && <div className="text-xs text-gray-600">Service: {serviceName}</div>}
                            <div className="text-xs text-gray-600 mt-1">Created By: {a.createdBy || 'Admin'}</div>
                          </div>
                          <div className="flex justify-end gap-2 px-3 pb-2">
                            <button className="text-xs text-blue-600 hover:underline" onClick={(e) => { e.stopPropagation(); onEditAppointment(a); }}>Edit</button>
                            <button className="text-xs text-red-600 hover:underline" onClick={(e) => { e.stopPropagation(); if (confirm('Delete this appointment?')) onDeleteAppointment(a); }}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Context menu */}
      {menu.open && (
        <>
          <div className="fixed inset-0 z-[80]" onClick={() => { closeMenu(); setBlockMenu({ open: false, x: 0, y: 0 }); }} />
          <div
            className="fixed z-[90] w-56 bg-white border border-gray-200 rounded-md shadow-md"
            style={{ left: menu.x, top: menu.y }}
          >
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">{indexToLabel(menu.index)}</div>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { onCreateAppointment({ index: menu.index, resource: menu.resource }); closeMenu(); }}>New appointment</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { onCreateGroupAppointment({ index: menu.index, resource: menu.resource }); closeMenu(); }}>New group appointment</button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
              onMouseEnter={() => setBlockMenu({ open: true, x: menu.x + 220, y: menu.y + 60 })}
              onMouseLeave={() => setBlockMenu((b) => ({ ...b, open: false }))}
              onClick={() => setBlockMenu({ open: true, x: menu.x + 220, y: menu.y + 60 })}
            >
              <span>Block Out Time</span>
              <span>›</span>
            </button>
          </div>

          {blockMenu.open && (
            <div
              className="fixed z-[95] w-64 bg-white border border-gray-200 rounded-md shadow-md"
              style={{ left: blockMenu.x, top: blockMenu.y }}
              onMouseEnter={() => setBlockMenu((b) => ({ ...b, open: true }))}
              onMouseLeave={() => setBlockMenu((b) => ({ ...b, open: false }))}
            >
              {blockReasons.map((r) => (
                <button
                  key={r}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  onClick={() => {
                    onBlockoutTime({ index: menu.index, resource: menu.resource, reason: r });
                    setBlockMenu({ open: false, x: 0, y: 0 });
                    closeMenu();
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* No left-click modal; only right-click menu is enabled */}
    </div>
  );
}


