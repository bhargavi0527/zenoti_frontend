import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ServiceCustomData() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNo: '',
    status: 'No Service Recommended',
    doctorName: '',
    centerName: 'Banjara Hills',
    employeeName: '',
    fsrA: '',
    fsrB: '',
    date: new Date().toLocaleDateString('en-GB'),
    recommendation1: 'LT',
    recommendation2: 'NA',
    recommendation3: 'NA',
    recommendation4: 'NA',
    recommendation5: 'NA',
    recommendation6: 'NA',
    recommendation7: 'NA',
    recommendation8: 'NA',
    signature: ''
  });

  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Initialize form data from location state if available
    if (location.state?.appointmentData) {
      const appointment = location.state.appointmentData;
      setFormData(prev => ({
        ...prev,
        mobileNo: appointment.guestPhone || '',
        doctorName: appointment.doctor || '',
        employeeName: appointment.createdBy || 'CRT Mary Shalini',
        centerName: appointment.resource || 'Banjara Hills'
      }));
    }
  }, [location.state]);

  // Initialize signature canvas
  useEffect(() => {
    if (signatureCanvas) {
      const ctx = signatureCanvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Add sample signature after a short delay to match the image
      setTimeout(() => {
        addSampleSignature();
      }, 100);
    }
  }, [signatureCanvas]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignatureStart = (e) => {
    setIsDrawing(true);
    const canvas = signatureCanvas;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleSignatureMove = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvas;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Add a sample signature to match the image
  const addSampleSignature = () => {
    if (!signatureCanvas) return;
    const ctx = signatureCanvas.getContext('2d');
    ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    
    // Draw a sample signature similar to the one in the image
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.quadraticCurveTo(100, 100, 150, 120);
    ctx.quadraticCurveTo(200, 80, 250, 100);
    ctx.quadraticCurveTo(300, 60, 350, 80);
    ctx.stroke();
    
    // Add some additional signature elements
    ctx.beginPath();
    ctx.moveTo(380, 140);
    ctx.lineTo(380, 60);
    ctx.stroke();
  };

  const handleSubmit = (action) => {
    console.log('Form submitted with action:', action, formData);
    // Handle different submit actions
    switch (action) {
      case 'submitAndClose':
        // Submit and close
        navigate(-1);
        break;
      case 'submitAndFillNext':
        // Submit and fill next
        alert('Submitted and ready for next appointment');
        break;
      case 'saveAndFillNext':
        // Save and fill next
        alert('Saved and ready for next appointment');
        break;
      case 'print':
        // Print
        window.print();
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm hover:bg-white/30"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg font-semibold">V-Discover Doctor's Consultation</h1>
            <p className="text-sm text-white/90">Service Custom Data</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8 px-4">
          <button className="py-3 px-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Oliva Doctor Recommendations V2
          </button>
          <button className="py-3 px-2 text-gray-600 hover:text-gray-900">
            Client Profile Form
          </button>
          <button className="py-3 px-2 text-gray-600 hover:text-gray-900">
            Skin And Hair Analysis Updated Version
          </button>
          <button className="py-3 px-2 text-gray-600 hover:text-gray-900">
            INVESTIGATION MONITORING SHEET
          </button>
          <button className="py-3 px-2 text-gray-600 hover:text-gray-900">
            Doctor Prescription New
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-3">
                O
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-teal-500">LIVA</div>
                <div className="text-sm text-gray-600">SKIN & HAIR CLINIC</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Oliva Doctor Recommendations</h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Mobile Number and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MOBILE NO *
                </label>
                <input
                  type="text"
                  value={formData.mobileNo}
                  onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  STATUS *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="No Service Recommended">No Service Recommended</option>
                  <option value="Service Recommended">Service Recommended</option>
                  <option value="Follow Up Required">Follow Up Required</option>
                </select>
              </div>
            </div>

            {/* Center Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">CENTER DETAILS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOCTOR NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CENTER NAME *
                  </label>
                  <select
                    value={formData.centerName}
                    onChange={(e) => handleInputChange('centerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Banjara Hills">Banjara Hills</option>
                    <option value="Jubilee Hills">Jubilee Hills</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Kondapur">Kondapur</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Employee Name and FSR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EMPLOYEE NAME *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FSR A
                </label>
                <select
                  value={formData.fsrA}
                  onChange={(e) => handleInputChange('fsrA', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FSR B
                </label>
                <select
                  value={formData.fsrB}
                  onChange={(e) => handleInputChange('fsrB', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DD/MM/YYYY"
              />
            </div>

            {/* Doctor Recommendations */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">OLIVA DOCTOR RECOMMENDATIONS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={num}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oliva Doctor Recommendations {num} *
                    </label>
                    {num === 1 ? (
                      <input
                        type="text"
                        value={formData[`recommendation${num}`]}
                        onChange={(e) => handleInputChange(`recommendation${num}`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter recommendation"
                      />
                    ) : (
                      <select
                        value={formData[`recommendation${num}`]}
                        onChange={(e) => handleInputChange(`recommendation${num}`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="NA">NA</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Follow Up">Follow Up</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature:
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-white">
                <canvas
                  ref={setSignatureCanvas}
                  width={600}
                  height={200}
                  className="border border-gray-200 rounded cursor-crosshair bg-white"
                  onMouseDown={handleSignatureStart}
                  onMouseMove={handleSignatureMove}
                  onMouseUp={handleSignatureEnd}
                  onMouseLeave={handleSignatureEnd}
                />
                <div className="text-center mt-2">
                  <button
                    onClick={clearSignature}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            </div>

            {/* Reviewed By */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviewed by
              </label>
              <p className="text-sm text-gray-600">Shdigital. (09 Sep 2025, 12:44 PM)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handleSubmit('submitAndClose')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Submit And Close
            </button>
            <button
              onClick={() => handleSubmit('submitAndFillNext')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Submit And Fill Next
            </button>
            <button
              onClick={() => handleSubmit('saveAndFillNext')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Save And Fill Next
            </button>
            <button
              onClick={() => handleSubmit('print')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}