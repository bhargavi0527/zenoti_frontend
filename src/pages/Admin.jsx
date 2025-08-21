import { useState } from 'react';
import Sidebar from '../components/Layouts/sidebar';
import Header from '../components/Layouts/Header';

function Admin() {
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Did You Know Banner */}
          <div className="bg-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Did You Know?</h3>
                  <p className="text-purple-100">
                    Businesses get over 57 bookings every month from Instagram and Facebook. 
                    Here's how to activate it in Zenoti.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50">
                  Setup guide
                </button>
                <button className="bg-purple-700 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-800">
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* Metrics and Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today ({currentDate})
                </h3>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Configure
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹0</div>
                  <div className="text-sm text-gray-600">Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0.0</div>
                  <div className="text-sm text-gray-600">Guest feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹0</div>
                  <div className="text-sm text-gray-600">Package sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹0</div>
                  <div className="text-sm text-gray-600">Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹0</div>
                  <div className="text-sm text-gray-600">Liabilities sold</div>
                </div>
                <div className="text-center col-span-2">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
              </div>
            </div>

            {/* Appointments Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointments by status</h3>
                <span className="text-sm text-gray-600">Total 0</span>
              </div>
              <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">No Data Found</p>
                  <p className="text-gray-400 text-xs">No data is available for the selected timeframe.</p>
                  <p className="text-gray-400 text-xs">Adjust the date range and try again.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons and Last Updated */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                Give feedback
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700">
                View reports
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()} 
              <button className="ml-2 text-blue-600 hover:text-blue-800">Refresh now</button>
            </div>
          </div>

          {/* Business Impact Banner */}
          <div className="bg-purple-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Zenoti's impact on your business in the last 12 months
                </h3>
                <div className="flex space-x-8">
                  <div>
                    <div className="text-2xl font-bold text-green-600">₹16,03,267</div>
                    <div className="text-sm text-gray-600">additional sales generated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">113</div>
                    <div className="text-sm text-gray-600">additional bookings created</div>
                  </div>
                </div>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700">
                More insights &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
