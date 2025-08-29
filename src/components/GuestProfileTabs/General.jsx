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

  useEffect(() => {
    setForm((f) => ({
      ...f,
      code: guest?.code || guest?.id || '',
      first_name: guest?.first_name || '',
      last_name: guest?.last_name || '',
      email: guest?.email || '',
      phone_no: guest?.phone_no || '',
      gender: guest?.gender || '',
      is_minor: Boolean(guest?.is_minor),
      referral: guest?.referral || '',
      referral_code: guest?.referral_code || guest?.code || '',
      center_name: guest?.center_name || '',
      pin_code: guest?.pin_code || guest?.pin || '',
      nationality: guest?.nationality || '',
      country: guest?.country || 'India',
      state: guest?.state || 'Telangana',
    }));
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

  return (
    <div className="p-1">
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Personal Info */}
        <div className="col-span-12 md:col-span-6">
          <div className="text-gray-900 font-medium mb-3">Personal Info</div>
          <div className="space-y-3">
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
    </div>
  );
}


