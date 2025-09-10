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
      const setupCanvas = () => {
        const ctx = signatureCanvas.getContext('2d');
        
        // Set canvas size to match display size
        const rect = signatureCanvas.getBoundingClientRect();
        signatureCanvas.width = rect.width * window.devicePixelRatio;
        signatureCanvas.height = rect.height * window.devicePixelRatio;
        
        // Scale the context to match device pixel ratio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Set drawing styles
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
      };

      setupCanvas();
      
      // Add sample signature after a short delay to match the image
      setTimeout(() => {
        addSampleSignature();
      }, 200);

      // Handle window resize
      const handleResize = () => {
        setupCanvas();
        setTimeout(() => {
          addSampleSignature();
        }, 100);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [signatureCanvas]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getEventPos = (e) => {
    const canvas = signatureCanvas;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleSignatureStart = (e) => {
    e.preventDefault();
    if (!signatureCanvas) return;
    
    setIsDrawing(true);
    const ctx = signatureCanvas.getContext('2d');
    const pos = getEventPos(e);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleSignatureMove = (e) => {
    e.preventDefault();
    if (!isDrawing || !signatureCanvas) return;
    
    const ctx = signatureCanvas.getContext('2d');
    const pos = getEventPos(e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleSignatureEnd = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!signatureCanvas) return;
    const ctx = signatureCanvas.getContext('2d');
    ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  };

  // Add a sample signature to match the image
  const addSampleSignature = () => {
    if (!signatureCanvas) return;
    const ctx = signatureCanvas.getContext('2d');
    const rect = signatureCanvas.getBoundingClientRect();
    
    // Clear and set background
    ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw a sample signature similar to the one in the image
    ctx.beginPath();
    ctx.moveTo(80, 180);
    ctx.quadraticCurveTo(150, 120, 220, 140);
    ctx.quadraticCurveTo(300, 100, 380, 120);
    ctx.quadraticCurveTo(460, 80, 540, 100);
    ctx.stroke();
    
    // Add some additional signature elements
    ctx.beginPath();
    ctx.moveTo(580, 180);
    ctx.lineTo(580, 80);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-semibold">V-Discover Doctor's Consultation</h1>
            <p className="text-sm text-white/90">Service Custom Data</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex space-x-8 px-6">
          <button className="py-4 px-3 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
            Oliva Doctor Recommendations V2
          </button>
          <button className="py-4 px-3 text-gray-600 hover:text-gray-900 text-sm" onClick={() => navigate('/client-profile-form', { state: { appointmentData: location?.state?.appointmentData } })}>
            Client Profile Form
          </button>
          <button className="py-4 px-3 text-gray-600 hover:text-gray-900 text-sm" onClick={() => navigate('/skin-hair-analysis', { state: { appointmentData: location?.state?.appointmentData } })}>
            Skin And Hair Analysis Updated Version
          </button>
          <button className="py-4 px-3 text-gray-600 hover:text-gray-900 text-sm">
            INVESTIGATION MONITORING SHEET
          </button>
          <button className="py-4 px-3 text-gray-600 hover:text-gray-900 text-sm">
            Doctor Prescription New
          </button>
        </div>
      </div>

      {/* Main Form - Full Page Layout */}
      <div className="w-full px-6 py-8">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
              O
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold text-teal-500">LIVA</div>
              <div className="text-base text-gray-600">SKIN & HAIR CLINIC</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Oliva Doctor Recommendations</h2>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Mobile Number and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                MOBILE NO *
              </label>
              <input
                type="text"
                value={formData.mobileNo}
                onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                STATUS *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="No Service Recommended">No Service Recommended</option>
                <option value="Service Recommended">Service Recommended</option>
                <option value="Follow Up Required">Follow Up Required</option>
              </select>
            </div>
          </div>

          {/* Center Details */}
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">CENTER DETAILS</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  DOCTOR NAME *
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  CENTER NAME *
                </label>
                <select
                  value={formData.centerName}
                  onChange={(e) => handleInputChange('centerName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                EMPLOYEE NAME *
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                FSR A
              </label>
              <select
                value={formData.fsrA}
                onChange={(e) => handleInputChange('fsrA', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="">Select</option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                FSR B
              </label>
              <select
                value={formData.fsrB}
                onChange={(e) => handleInputChange('fsrB', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="">Select</option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Date *
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full lg:w-64 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* Doctor Recommendations */}
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">OLIVA DOCTOR RECOMMENDATIONS</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div key={num}>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    Oliva Doctor Recommendations {num} *
                  </label>
                  {num === 1 ? (
                    <input
                      type="text"
                      value={formData[`recommendation${num}`]}
                      onChange={(e) => handleInputChange(`recommendation${num}`, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter recommendation"
                    />
                  ) : (
                    <select
                      value={formData[`recommendation${num}`]}
                      onChange={(e) => handleInputChange(`recommendation${num}`, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
            <label className="block text-base font-medium text-gray-700 mb-3">
              Signature:
            </label>
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <canvas
                ref={setSignatureCanvas}
                className="border border-gray-200 rounded cursor-crosshair bg-white w-full h-64"
                onMouseDown={handleSignatureStart}
                onMouseMove={handleSignatureMove}
                onMouseUp={handleSignatureEnd}
                onMouseLeave={handleSignatureEnd}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  handleSignatureStart(mouseEvent);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  handleSignatureMove(mouseEvent);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  const mouseEvent = new MouseEvent('mouseup', {});
                  handleSignatureEnd(mouseEvent);
                }}
              />
              <div className="text-center mt-4">
                <button
                  onClick={clearSignature}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-base"
                >
                  CLEAR
                </button>
              </div>
            </div>
          </div>

          {/* Reviewed By */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Reviewed by
            </label>
            <p className="text-base text-gray-600">Shdigital. (09 Sep 2025, 12:44 PM)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => handleSubmit('submitAndClose')}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-base"
          >
            Submit And Close
          </button>
          <button
            onClick={() => handleSubmit('submitAndFillNext')}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-base"
          >
            Submit And Fill Next
          </button>
          <button
            onClick={() => handleSubmit('saveAndFillNext')}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-base"
          >
            Save And Fill Next
          </button>
          <button
            onClick={() => handleSubmit('print')}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-base"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}