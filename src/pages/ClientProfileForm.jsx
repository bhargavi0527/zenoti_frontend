import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ClientProfileForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    idNumber: '',
    date: new Date().toLocaleDateString('en-GB'),
    firstName: '',
    lastName: '',
    gender: '',
    mobile: '',
    altNo: '',
    occupation: '',
    address: '',
    email: '',
    preferredTimeToCall: '',
    referredBy: '',
    drReferral: 'No',
    others: '',
    skinConcern: '',
    hairConcern: '',
    bodyConcern: '',
    treatmentsTaken: '',
    currentHealthIssue: '',
    medications: '',
    allergies: 'No',
    majorHealthConcerns: 'None',
    emotionalFactors: 'No',
    lifestyleSunlight: 'Moderate',
    lifestyleSmoke: 'No',
    lifestyleAlcohol: 'No',
    lifestyleExercise: 'No',
    lifestyleDiet: 'Non-Vegetarian,Vegetarian',
    receivedBy: '',
    doctorName: '',
    clientName: '',
  });

  // Prefill from appointment if available
  useEffect(() => {
    const a = location.state?.appointmentData;
    if (!a) return;
    setFormData((p) => ({
      ...p,
      firstName: a.guestFirstName || p.firstName,
      lastName: a.guestLastName || p.lastName,
      mobile: a.guestPhone || p.mobile,
      receivedBy: a.createdBy || p.receivedBy,
      doctorName: a.doctor || p.doctorName,
      clientName: `${a.guestFirstName || ''} ${a.guestLastName || ''}`.trim() || p.clientName,
    }));
  }, [location.state]);

  const onChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  // Minimal signature canvas like reference
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
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const pos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onDown = (e) => { setDrawing(true); const p = pos(e); canvasRef.current.getContext('2d').beginPath(); canvasRef.current.getContext('2d').moveTo(p.x, p.y); };
  const onMove = (e) => { if (!drawing) return; const p = pos(e); const ctx = canvasRef.current.getContext('2d'); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const onUp = () => setDrawing(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4 px-4 py-3 text-sm">
          <button className="px-2 py-1 hover:underline" onClick={() => navigate('/service-custom-data', { state: location.state })}>Oliva Doctor Recommendations V2</button>
          <button className="px-2 py-1 border-b-2 border-blue-600 text-blue-600 font-medium">Client Profile Form</button>
          <button className="px-2 py-1 hover:underline">Skin And Hair Analysis Updated Version</button>
          <button className="px-2 py-1 hover:underline">INVESTIGATION MONITORING SHEET</button>
          <button className="px-2 py-1 hover:underline">Doctor Prescription New</button>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-bold">O</div>
            <div className="text-left">
              <div className="text-2xl font-bold text-teal-600">LIVA</div>
              <div className="text-xs text-gray-500 tracking-wide">SKIN • HAIR • BODY CLINIC</div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wide">CLIENT PROFILE FORM</h1>
        </div>

        {/* Top row: ID and Date */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
            <input value={formData.idNumber} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input value={formData.date} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
          </div>
        </div>

        {/* Personal Details */}
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name (Bold Letters)</label>
            <input value={formData.firstName} onChange={(e) => onChange('firstName', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input value={formData.lastName} onChange={(e) => onChange('lastName', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <input value={formData.gender} onChange={(e) => onChange('gender', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
            <input value={formData.occupation} onChange={(e) => onChange('occupation', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
            <input value={formData.mobile} onChange={(e) => onChange('mobile', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alt No</label>
            <input value={formData.altNo} onChange={(e) => onChange('altNo', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <input value={formData.address} onChange={(e) => onChange('address', e.target.value)} className="w-full px-4 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
            <input value={formData.email} onChange={(e) => onChange('email', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time to Call</label>
            <input value={formData.preferredTimeToCall} onChange={(e) => onChange('preferredTimeToCall', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* Referral section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How Did You Get To Know About Oliva? *</label>
            <input value={formData.referredBy} onChange={(e) => onChange('referredBy', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">(or) Dr.Referral *</label>
            <input value={formData.drReferral} onChange={(e) => onChange('drReferral', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Others</label>
            <input value={formData.others} onChange={(e) => onChange('others', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* What brings you to Oliva */}
        <h2 className="text-xl font-semibold mt-10 mb-4">What Bring You To Oliva</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skin Concern *</label>
            <input value={formData.skinConcern} onChange={(e) => onChange('skinConcern', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hair Concern *</label>
            <input value={formData.hairConcern} onChange={(e) => onChange('hairConcern', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Body Concern *</label>
          <input value={formData.bodyConcern} onChange={(e) => onChange('bodyConcern', e.target.value)} className="w-full px-4 py-2 border rounded" />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Treatments Taken So Far</label>
          <input value={formData.treatmentsTaken} onChange={(e) => onChange('treatmentsTaken', e.target.value)} className="w-full px-4 py-2 border rounded" />
        </div>

        {/* General Health */}
        <h2 className="text-xl font-semibold mt-10 mb-4">About Your General Health</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Health Issue *</label>
            <input value={formData.currentHealthIssue} onChange={(e) => onChange('currentHealthIssue', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Any Medications Being Used Currently *</label>
            <input value={formData.medications} onChange={(e) => onChange('medications', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Any Allergies To Medicines/Foods/Others *</label>
            <input value={formData.allergies} onChange={(e) => onChange('allergies', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major Health Concerns Or Surgeries In The Past</label>
            <input value={formData.majorHealthConcerns} onChange={(e) => onChange('majorHealthConcerns', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emotional Factors/Stress</label>
            <input value={formData.emotionalFactors} onChange={(e) => onChange('emotionalFactors', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* Lifestyle */}
        <h2 className="text-xl font-semibold mt-10 mb-4">About Your Life Style</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sunlight Exposure *</label>
            <input value={formData.lifestyleSunlight} onChange={(e) => onChange('lifestyleSunlight', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diet *</label>
            <input value={formData.lifestyleDiet} onChange={(e) => onChange('lifestyleDiet', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Do You Smoke *</label>
            <input value={formData.lifestyleSmoke} onChange={(e) => onChange('lifestyleSmoke', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Do You Consume Alcohol *</label>
            <input value={formData.lifestyleAlcohol} onChange={(e) => onChange('lifestyleAlcohol', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise/Swimming *</label>
            <input value={formData.lifestyleExercise} onChange={(e) => onChange('lifestyleExercise', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* Declaration + Signature */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input value={formData.date} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Client's Name</label>
              <input value={formData.clientName} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client's Signature *</label>
            <div className="border rounded p-2 bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-40 border"
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseUp={onUp}
                onMouseLeave={onUp}
              />
              <div className="text-xs text-center text-gray-500 mt-1">Sign above</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </div>
  );
}

