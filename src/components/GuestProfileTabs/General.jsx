import React, { useEffect, useState } from 'react';

export default function GeneralTab({ guest }) {
  const [form, setForm] = useState({
    code: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    preferred_name: '',
    email: '',
    phone_cc: '+91',
    phone_no: '',
    home_cc: '+91',
    home_no: '',
    work_cc: '+91',
    work_no: '',
    gender: '',
    is_minor: false,
    birthday_day: '',
    birthday_month: '',
    birthday_year: '',
    anniversary: '',
    referral: '',
    primary_employee: '',
    pan: '',
    referral_code: '',
    block_guest_custom_data: false,
    address1: '',
    address2: '',
    city: '',
    nationality: '',
    country: '',
    state: '',
    state_other: '',
    pin_code: '',
    center_name: '',
    language: 'English- United States',
    tm_email: true,
    tm_sms: true,
    mm_email: true,
    mm_sms: true,
    mm_point_statement: true,
    loyalty_opt_in: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      code: guest?.guest_code || guest?.code || '',
      first_name: guest?.first_name || '',
      last_name: guest?.last_name || '',
      email: guest?.email || '',
      phone_no: guest?.phone_no || '',
      gender: guest?.gender || '',
      is_minor: Boolean(guest?.is_minor),
      referral: guest?.referral || '',
      referral_code: (() => {
        const gc = guest?.guest_code || guest?.code || '';
        const rc = guest?.referral_code || '';
        return rc && rc === gc ? rc : '';
      })(),
      center_name: guest?.center_name || '',
      pin_code: guest?.pin_code || guest?.pin || '',
      nationality: guest?.nationality || '',
      country: guest?.country || 'India',
      state: guest?.state || 'Telangana',
    }));

    // Prefill birthday selects from guest.date_of_birth (YYYY-MM-DD)
    const dob = guest?.date_of_birth;
    if (dob && typeof dob === 'string' && dob.length >= 10) {
      const yyyy = dob.slice(0, 4);
      const mm = dob.slice(5, 7);
      const dd = dob.slice(8, 10);
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthIndex = Number(mm) - 1;
      const monthName = monthIndex >= 0 && monthIndex < 12 ? monthNames[monthIndex] : '';
      setForm((f) => ({
        ...f,
        birthday_year: yyyy || '',
        birthday_month: monthName || '',
        birthday_day: dd ? String(Number(dd)) : ''
      }));
    }
  }, [guest]);

  const on = (key) => ({
    value: form[key] ?? '',
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  });

  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const monthOptions = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ];
  const yearOptions = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

  const monthToNumber = (m) => {
    const map = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
    return map[m] || '';
  };

  const computeDob = () => {
    if (form.birthday_year && form.birthday_month && form.birthday_day) {
      const mm = monthToNumber(form.birthday_month);
      const dd = String(form.birthday_day).padStart(2, '0');
      if (mm) return `${form.birthday_year}-${mm}-${dd}`;
    }
    return guest?.date_of_birth || '';
  };

  const onSave = async () => {
    const code = guest?.guest_code || guest?.code || form.code;
    if (!code) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const payload = {
        center_id: form.center_id || guest?.center_id,
        center_name: form.center_name || guest?.center_name,
        username: form.username || guest?.username,
        first_name: form.first_name || guest?.first_name,
        middle_name: form.middle_name || guest?.middle_name,
        last_name: form.last_name || guest?.last_name,
        email: form.email || guest?.email,
        phone_no: form.phone_no || guest?.phone_no,
        home_no: form.home_no || guest?.home_no,
        gender: form.gender || guest?.gender,
        date_of_birth: computeDob() || guest?.date_of_birth,
        is_minor: typeof form.is_minor === 'boolean' ? form.is_minor : Boolean(guest?.is_minor),
        nationality: form.nationality || guest?.nationality,
        language: form.language || guest?.language,
        id: guest?.id,
        guest_code: code,
        created_at: guest?.created_at,
        updated_at: new Date().toISOString()
      };

      const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(code)}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setSaveSuccess(true);
    } catch (e) {
      setSaveError('Failed to update guest');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="p-1">
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Personal Info */}
        <div className="col-span-12 md:col-span-6">
          <div className="text-gray-900 font-medium mb-3">Personal Info</div>
          <div className="space-y-3">
            {saveError && (<div className="text-sm text-red-600">{saveError}</div>)}
            {saveSuccess && (<div className="text-sm text-green-700">Guest updated</div>)}
            <div>
              <div className="text-sm text-gray-500">Customer ID</div>
              <input className="w-full border rounded px-2 py-1 text-sm bg-gray-100" readOnly {...on('code')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">First Name</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('first_name')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Middle Name</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('middle_name')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Last Name</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('last_name')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Preferred Name</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('preferred_name')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <input type="email" className="w-full border rounded px-2 py-1 text-sm" {...on('email')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Mobile Phone</div>
              <div className="flex gap-2">
                <input className="w-20 border rounded px-2 py-1 text-sm" {...on('phone_cc')} />
                <input className="flex-1 border rounded px-2 py-1 text-sm" {...on('phone_no')} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Home Phone</div>
              <div className="flex gap-2">
                <input className="w-20 border rounded px-2 py-1 text-sm" {...on('home_cc')} />
                <input className="flex-1 border rounded px-2 py-1 text-sm" {...on('home_no')} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Work Phone</div>
              <div className="flex gap-2">
                <input className="w-20 border rounded px-2 py-1 text-sm" {...on('work_cc')} />
                <input className="flex-1 border rounded px-2 py-1 text-sm" {...on('work_no')} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Gender</div>
              <select className="w-full border rounded px-2 py-1 text-sm bg-white" {...on('gender')}>
                <option value="">Select Gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.is_minor} onChange={(e) => setForm((f) => ({ ...f, is_minor: e.target.checked }))} />
              This Guest is a minor
            </label>

            <div>
              <div className="text-sm text-gray-500">Birthday</div>
              <div className="flex gap-2">
                <select className="border rounded px-2 py-1 text-sm bg-white" {...on('birthday_day')}>
                  <option value="">Day</option>
                  {dayOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
                <select className="border rounded px-2 py-1 text-sm bg-white" {...on('birthday_month')}>
                  <option value="">Month</option>
                  {monthOptions.map((m) => (<option key={m} value={m}>{m}</option>))}
                </select>
                <select className="border rounded px-2 py-1 text-sm bg-white" {...on('birthday_year')}>
                  <option value="">Year</option>
                  {yearOptions.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Anniversary</div>
              <input placeholder="DD-MM-YYYY" className="w-48 border rounded px-2 py-1 text-sm" {...on('anniversary')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Referral</div>
              <select className="w-64 border rounded px-2 py-1 text-sm bg-white" {...on('referral')}>
                <option value="">Select Source</option>
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Walk-in</option>
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-500">Primary Employee</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('primary_employee')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">PAN</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('pan')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Referral Code</div>
              <input className="w-full border rounded px-2 py-1 text-sm bg-gray-100" readOnly {...on('referral_code')} />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.block_guest_custom_data} onChange={(e) => setForm((f) => ({ ...f, block_guest_custom_data: e.target.checked }))} />
              Block guest from editing custom data
            </label>
          </div>
        </div>

        {/* Right: Address + Preferences */}
        <div className="col-span-12 md:col-span-6">
          <div className="text-gray-900 font-medium mb-3">Address</div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Address 1</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('address1')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Address 2</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('address2')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">City</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('city')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Nationality</div>
              <select className="w-full border rounded px-2 py-1 text-sm bg-white" {...on('nationality')}>
                <option value="">Select Nationality</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-500">Country</div>
              <select className="w-full border rounded px-2 py-1 text-sm bg-white" {...on('country')}>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-500">State</div>
              <select className="w-full border rounded px-2 py-1 text-sm bg-white" {...on('state')}>
                <option>Telangana</option>
                <option>Karnataka</option>
                <option>Maharashtra</option>
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-500">State (Other)</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('state_other')} />
            </div>
            <div>
              <div className="text-sm text-gray-500">PIN Code</div>
              <input className="w-full border rounded px-2 py-1 text-sm" {...on('pin_code')} />
            </div>
          </div>

          <div className="text-gray-900 font-medium mt-6 mb-3">Preferences</div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Center</div>
              <select className="w-full border rounded px-2 py-1 text-sm bg-white" {...on('center_name')}>
                <option>Corporate Training Center</option>
                <option>Hyderabad - Banjara Hills</option>
                <option>Bengaluru - Indiranagar</option>
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-500">Language</div>
              <select className="w-full border rounded px-2 py-1 text-sm bg-white" {...on('language')}>
                <option>English- United States</option>
                <option>English- United Kingdom</option>
                <option>Hindi</option>
              </select>
            </div>

            <div className="text-sm text-gray-900 mt-4">Transactional Messages</div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.tm_email} onChange={(e)=>setForm((f)=>({...f, tm_email: e.target.checked}))} />
              Email
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.tm_sms} onChange={(e)=>setForm((f)=>({...f, tm_sms: e.target.checked}))} />
              SMS
            </label>

            <div className="text-sm text-gray-900 mt-4">Marketing Messages</div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.mm_email} onChange={(e)=>setForm((f)=>({...f, mm_email: e.target.checked}))} />
              Email
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.mm_sms} onChange={(e)=>setForm((f)=>({...f, mm_sms: e.target.checked}))} />
              SMS
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.mm_point_statement} onChange={(e)=>setForm((f)=>({...f, mm_point_statement: e.target.checked}))} />
              Receive loyalty point statement as a text message (SMS) and an email
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-3 w-3" checked={form.loyalty_opt_in} onChange={(e)=>setForm((f)=>({...f, loyalty_opt_in: e.target.checked}))} />
              Opt in to Loyalty program
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onSave}
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {saving ? 'Updating...' : 'Update Guest'}
        </button>
      </div>
    </div>
  );
}


