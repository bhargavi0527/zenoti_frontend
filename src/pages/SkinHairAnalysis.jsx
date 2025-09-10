import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SkinHairAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  // Basic form state to mirror the reference (subset for demo)
  const [form, setForm] = useState({
    clientName: '',
    clientId: '',
    age: '',
    gender: 'Female',
    date: new Date().toLocaleDateString('en-GB'),
    maritalStatus: 'Married',
    daysFlow: '3-4',
    daysCycle: '28-30',
    lmp: new Date().toLocaleDateString('en-GB'),
  });

  useEffect(() => {
    const a = location.state?.appointmentData;
    if (!a) return;
    setForm((p) => ({
      ...p,
      clientName: `${a.guestFirstName || ''} ${a.guestLastName || ''}`.trim(),
      clientId: a.guestCode || a.guestId || a.guest_backend_id || '',
      gender: a.guestGender || p.gender,
    }));
  }, [location.state]);

  const onChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  // Treatment Road Map canvas
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, []);
  const pos = (e) => {
    const c = canvasRef.current; const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onDown = (e) => { setDrawing(true); const p = pos(e); const ctx = canvasRef.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const onMove = (e) => { if (!drawing) return; const p = pos(e); const ctx = canvasRef.current.getContext('2d'); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const onUp = () => setDrawing(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4 px-4 py-3 text-sm">
          <button className="px-2 py-1 hover:underline" onClick={() => navigate('/service-custom-data', { state: location.state })}>Oliva Doctor Recommendations V2</button>
          <button className="px-2 py-1 hover:underline" onClick={() => navigate('/client-profile-form', { state: location.state })}>Client Profile Form</button>
          <button className="px-2 py-1 border-b-2 border-blue-600 text-blue-600 font-medium">Skin And Hair Analysis Updated Version</button>
          <button className="px-2 py-1 hover:underline">INVESTIGATION MONITORING SHEET</button>
          <button className="px-2 py-1 hover:underline">Doctor Prescription New</button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">SKIN AND HAIR ANALYSIS FORM</h1>
        </div>

        {/* Top info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Client's Name:</label>
            <input className="w-full border rounded px-3 py-2" value={form.clientName} onChange={(e)=>onChange('clientName', e.target.value)} />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-1">Client's ID:</label>
            <input className="w-full border rounded px-3 py-2" value={form.clientId} onChange={(e)=>onChange('clientId', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age: *</label>
            <input className="w-full border rounded px-3 py-2" value={form.age} onChange={(e)=>onChange('age', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender: *</label>
            <select className="w-full border rounded px-3 py-2" value={form.gender} onChange={(e)=>onChange('gender', e.target.value)}>
              <option>Female</option>
              <option>Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date: *</label>
            <input className="w-full border rounded px-3 py-2" value={form.date} onChange={(e)=>onChange('date', e.target.value)} />
          </div>
        </div>

        {/* Menstrual cycle subset */}
        <div className="mt-6 border rounded">
          <div className="bg-gray-900 text-white px-4 py-2 text-sm font-semibold">MENSTRUAL CYCLE</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div>
              <label className="block text-sm font-medium mb-1">Days Flow:</label>
              <input className="w-full border rounded px-3 py-2" value={form.daysFlow} onChange={(e)=>onChange('daysFlow', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Days Cycle:</label>
              <input className="w-full border rounded px-3 py-2" value={form.daysCycle} onChange={(e)=>onChange('daysCycle', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LMP:</label>
              <input className="w-full border rounded px-3 py-2" value={form.lmp} onChange={(e)=>onChange('lmp', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Obstetric history */}
        <div className="mt-6 border rounded p-4">
          <h3 className="font-semibold text-sm mb-3">OBSTETRIC HISTORY</h3>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {['P','L','A','LCB'].map((k) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1">{k} *</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            ))}
            <div className="flex items-end gap-6">
              <div className="flex items-center gap-2"><input type="radio" name="tubectomy" defaultChecked /><span>Yes</span></div>
              <div className="flex items-center gap-2"><input type="radio" name="tubectomy" /><span>No</span></div>
              <div className="flex items-center gap-2"><input type="radio" name="tubectomy" /><span>NA</span></div>
            </div>
            <div className="flex items-end gap-6">
              <div className="flex items-center gap-2"><input type="radio" name="planning" /><span>Yes</span></div>
              <div className="flex items-center gap-2"><input type="radio" name="planning" defaultChecked /><span>No</span></div>
              <div className="flex items-center gap-2"><input type="radio" name="planning" /><span>NA</span></div>
            </div>
          </div>
        </div>

        {/* Chief Concerns */}
        <div className="mt-6 border rounded p-4">
          <label className="block text-sm font-medium mb-2">Chief Skin Concerns & Hair Concerns: *</label>
          <textarea className="w-full border rounded px-3 py-2 h-20" />

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">History of Psoriasis/Vitiligo/Other Chronic Skin Problems:</label>
            <div className="flex items-center gap-6 mb-2">
              <div className="flex items-center gap-2"><input type="radio" name="chronic" /><span>Yes</span></div>
              <div className="flex items-center gap-2"><input type="radio" name="chronic" defaultChecked /><span>No</span></div>
            </div>
            <label className="block text-sm font-medium mb-2">Details:</label>
            <textarea className="w-full border rounded px-3 py-2 h-20" />
          </div>
        </div>

        {/* Family medical history */}
        <div className="mt-6 border rounded p-4">
          <h3 className="font-semibold text-sm mb-3">History of Chronic Medical Problems in the Family: *</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-3">
            {['Asthma','Allergies','Diabetes','Hypertension','PCOS','Thyroid Problem','Heart Disease','Stroke','None','Other'].map((c) => (
              <label key={c} className="inline-flex items-center gap-2"><input type="checkbox" /><span>{c}</span></label>
            ))}
          </div>
          <div className="mt-4">
            <span className="mr-4">History Of Scalp Hair Loss In Other Family Members:</span>
            <label className="mr-4"><input type="radio" name="scalpLoss" /> <span>Yes</span></label>
            <label className="mr-4"><input type="radio" name="scalpLoss" defaultChecked /> <span>No</span></label>
            <label><input type="radio" name="scalpLoss" /> <span>NA</span></label>
          </div>
          <div className="mt-4">
            <span className="mr-4">History Of Excessive Facial/Body Hair In Female Relatives:</span>
            <label className="mr-4"><input type="radio" name="excessHair" /> <span>Yes</span></label>
            <label className="mr-4"><input type="radio" name="excessHair" defaultChecked /> <span>No</span></label>
            <label><input type="radio" name="excessHair" /> <span>NA</span></label>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Other Relevant History:</label>
            <textarea className="w-full border rounded px-3 py-2 h-20" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Medication History (Including Nutritional Supplements And Homeopathic/Ayurvedic/Unani/Other Medicines):</label>
            <textarea className="w-full border rounded px-3 py-2 h-20" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Remarks:</label>
            <textarea className="w-full border rounded px-3 py-2 h-24" />
          </div>
        </div>

        {/* Clinical examination fields */}
        <div className="mt-6 border rounded p-4">
          <h3 className="font-semibold text-sm mb-4">CLINICAL EXAMINATION</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Weight (Kg):</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">BMI:</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Other Relevant Findings:</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mucosa:</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nails:</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Skin and Trichoscopic analysis wrapper */}
        <div className="mt-6 border rounded">
          <div className="bg-gray-900 text-white px-4 py-2 text-sm font-semibold">SKIN AND TRICHOSCOPIC ANALYSIS</div>
          {/* Skin Analysis */}
          <div className="p-4 border-b">
            <div className="bg-gray-900/90 text-white px-4 py-2 text-sm font-semibold rounded">SKIN ANALYSIS</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date: *</label>
                <input className="w-full border rounded px-3 py-2" defaultValue={new Date().toLocaleDateString('en-GB')} />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium mb-1">Skin Analysis Findings: *</label>
                <textarea className="w-full border rounded px-3 py-2 h-20" defaultValue="Melasma" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              {['F','H','S'].map((k) => (
                <div key={k}>
                  <label className="block text-sm font-medium mb-1">{k}</label>
                  <select className="w-full border rounded px-3 py-2"><option>{k}5</option><option>{k}3</option></select>
                </div>
              ))}
            </div>
            {/* Precautions */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Precautions</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {['Herpes Labialis/Genitalis','Rosacea/TSDF/Other Dysfunction','Co-Morbidities','Atopy','Koebnerisation','BDD','Allergies','Ongoing Photo Sensitising/Anti Coagulant Medications','Diagnosis'].map((label) => (
                  <div key={label}>
                    <label className="block text-sm font-medium mb-1">{label}: *</label>
                    <input className="w-full border rounded px-3 py-2" defaultValue="No" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trichoscopic Analysis */}
          <div className="p-4">
            <div className="bg-gray-900/90 text-white px-4 py-2 text-sm font-semibold rounded">TRICHOSCOPIC ANALYSIS</div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Colour:</label>
                <select className="w-full border rounded px-3 py-2"><option>Black</option></select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scaling:</label>
                <select className="w-full border rounded px-3 py-2"><option>No</option></select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Evidence Of Scarring:</label>
                <select className="w-full border rounded px-3 py-2"><option>No</option></select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Texture:</label>
                <select className="w-full border rounded px-3 py-2"><option>Normal</option></select>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div>
                <span className="mr-3">Widened Parting:</span>
                <label className="mr-4"><input type="radio" name="widened" /> Yes</label>
                <label className="mr-4"><input type="radio" name="widened" defaultChecked /> No</label>
              </div>
              <div>
                <span className="mr-3">Frontal Thinning:</span>
                <label className="mr-4"><input type="radio" name="thinning" /> Yes</label>
                <label className="mr-4"><input type="radio" name="thinning" defaultChecked /> No</label>
              </div>
            </div>

            {/* Hair Scope Findings table */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Hair Scope Findings</h4>
              {['Frontal','Temporal','Vertex','Occipital'].map((row) => (
                <div key={row} className="grid grid-cols-2 lg:grid-cols-6 gap-3 py-2 border-b items-center">
                  <div className="font-medium">{row}</div>
                  {['HDD','Kenogendots','Scalp Scaling','Others','Peripilar Fibrosis','NA'].map((c)=> (
                    <label key={c} className="inline-flex items-center gap-2"><input type="checkbox" />{c}</label>
                  ))}
                </div>
              ))}
            </div>

            {/* Others */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium mb-1">Roots of Pulled Hair</label>
                <div className="flex flex-wrap gap-4">
                  {['Anagen','Telogen','Dystrophic','Dysplastic','NA'].map((o)=> (
                    <label key={o} className="inline-flex items-center gap-2"><input type="radio" name="roots" />{o}</label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hair pull Test (If Applicable)</label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="pull" />Positive</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="pull" defaultChecked />Negative</label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">Provisional Diagnosis (Including Grade of PHL, If Relevant): *</label>
              <select className="w-full border rounded px-3 py-2"><option>-</option></select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Comments:</label>
              <textarea className="w-full border rounded px-3 py-2 h-24" />
            </div>
          </div>
        </div>

        {/* Treatment Road Map Canvas */}
        <div className="mt-10">
          <h2 className="font-semibold mb-3">Treatment Road Map:</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] gap-4">
            <div className="border rounded">
              <canvas
                ref={canvasRef}
                className="w-full h-[420px] bg-white"
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseUp={onUp}
                onMouseLeave={onUp}
              />
            </div>
            <div className="flex flex-col gap-2">
              {['Undo','Camera','Rectangle','Oval','Text','Arrow','Draw','Injection','Redo'].map((b)=> (
                <button key={b} className="py-2 px-3 bg-sky-600 text-white rounded">{b}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

