# API Integration Changes for Appointment Booking System

## Overview
This document outlines the changes made to integrate the appointment booking system with the backend API endpoints for fetching appointment slots and guest details.

## Changes Made

### 1. New API Functions Added

#### `fetchAppointmentSlots(appointmentDate)`
- **Purpose**: Fetches appointment slots for a specific date from the backend API
- **Endpoint**: `GET http://127.0.0.1:8000/appointments/slots/?appointment_date={date}`
- **Parameters**: 
  - `appointmentDate`: Date in YYYY-MM-DD format
- **Returns**: Array of appointment slot objects
- **Example Response**:
```json
[
  {
    "center_id": "bcf1aeea-1038-439a-ba1d-fc31a4c3e39d",
    "provider_id": "6872143c-f11e-40ab-85d5-f0c695de29ac",
    "service_id": "4f4dd07b-7ff3-4e90-b61a-e860f0770674",
    "status": "scheduled",
    "notes": "",
    "scheduled_time": "2025-08-25T14:15:00",
    "guest_id": "39a2436a-6126-4722-a5bb-cdee01c1a5c5",
    "appointment_date": "2025-08-25",
    "id": "bab1fdcf-ada3-40cd-b446-e5a2f02b5ff0",
    "created_at": "2025-08-25T09:45:05.623766",
    "updated_at": "2025-08-25T10:00:56.038907"
  }
]
```

#### `fetchGuestById(guestId)`
- **Purpose**: Fetches detailed guest information by guest ID
- **Endpoint**: `GET http://127.0.0.1:8000/guests/{guestId}`
- **Parameters**:
  - `guestId`: Unique identifier for the guest
- **Returns**: Guest object with normalized field names
- **Example Response**:
```json
{
  "center_id": "bcf1aeea-1038-439a-ba1d-fc31a4c3e39d",
  "center_name": "Hyderabad",
  "username": "d2d1756119968137",
  "first_name": "d2",
  "middle_name": "",
  "last_name": "d",
  "email": "d2@gmail.com",
  "phone_no": "+919876543217",
  "home_no": "+91",
  "gender": "Male",
  "date_of_birth": "2003-11-28",
  "is_minor": false,
  "nationality": "Indian",
  "language": "English",
  "id": "0998d090-08eb-42bc-85d1-efef30b09175",
  "guest_code": "GUEST372775",
  "created_at": "2025-08-25T11:06:08.145513",
  "updated_at": "2025-08-25T11:06:08.145515"
}
```

### 2. Modified Appointment Loading Logic

#### Updated `useEffect` in `Appointments.jsx`
- **Changes**: 
  - Replaced generic appointments fetch with date-specific slots fetch
  - Added guest details fetching for each appointment slot
  - Enhanced error handling and logging
  - Improved data transformation and mapping

#### Key Improvements:
1. **Date-specific fetching**: Now fetches only appointments for the selected date
2. **Guest details integration**: Automatically fetches and includes guest information
3. **Better error handling**: Graceful fallback to local data on API failures
4. **Enhanced logging**: Console logs for debugging API interactions

### 3. Data Structure Enhancements

#### Appointment Object Structure
The appointment objects now include additional guest-related fields:
```javascript
{
  id: slot.id,
  resource: provider?.name || 'Unknown',
  startIndex: getStartIndexFromIso(slot.scheduled_time),
  durationSlots: 4,
  label: service?.name || 'Appointment',
  color: 'bg-green-200 text-green-900',
  doctor: provider?.name || '',
  services: service ? [{ serviceName: service.name, serviceId: service.id }] : [],
  createdBy: 'System',
  backendAppointmentId: slot.id,
  guestId: slot.guest_id,
  guestFirstName: guestDetails?.firstName || '',
  guestLastName: guestDetails?.lastName || '',
  guestEmail: guestDetails?.email || '',
  guestPhone: guestDetails?.phone || '',
  guestGender: guestDetails?.gender || '',
  guestIsMinor: guestDetails?.isMinor || false,
  guestCode: guestDetails?.guestCode || '',
  appointmentDate: slot.appointment_date,
  scheduledTime: slot.scheduled_time,
  status: slot.status,
  notes: slot.notes
}
```

### 4. UI Integration

#### Booking Slots Component
- **Enhanced display**: Shows guest names and contact information in appointment cards
- **Improved tooltips**: Displays comprehensive appointment details on hover/click
- **Better data presentation**: Uses fetched guest data for labels and information

#### Appointment Dialog
- **Guest information**: Pre-populates guest fields when editing existing appointments
- **Data consistency**: Maintains consistency between backend and frontend data structures

## Usage

### Fetching Appointments for a Date
```javascript
// The system automatically fetches appointments when the date changes
const appointments = await fetchAppointmentSlots('2025-08-25');
```

### Fetching Guest Details
```javascript
// Guest details are automatically fetched for each appointment
const guestDetails = await fetchGuestById('39a2436a-6126-4722-a5bb-cdee01c1a5c5');
```

## Error Handling

1. **API Failures**: System gracefully falls back to locally saved data
2. **Network Issues**: Console logging helps identify connectivity problems
3. **Data Validation**: Invalid responses are filtered out safely
4. **Guest Fetch Failures**: Appointments are still displayed even if guest details fail to load

## Debugging

The system includes comprehensive console logging:
- API request/response logging
- Data transformation logging
- Error logging with context
- Guest fetching status logging

To debug issues:
1. Open browser developer tools
2. Check console for API interaction logs
3. Verify API endpoints are accessible
4. Check network tab for failed requests

## Future Enhancements

1. **Caching**: Implement client-side caching for frequently accessed data
2. **Real-time updates**: Add WebSocket support for live appointment updates
3. **Offline support**: Enhance local storage for offline functionality
4. **Performance optimization**: Implement pagination for large datasets 