# Zenoti Frontend - Admin Dashboard

A React-based admin dashboard application for Oliva Skin & Hair Clinic, built with Vite and Tailwind CSS.

## Features

### Login Page (`/login`)
- OLIVA branding with stylized logo
- Username and password fields with dummy credentials
- Password visibility toggle
- Social media links
- Promotional banner for Innergize event
- Responsive design

### Admin Dashboard (`/admin`)
- Left sidebar navigation with icons
- Header with user controls and notifications
- "Did You Know?" promotional banner
- Key metrics display (appointments, sales, feedback, etc.)
- Appointments by status chart (with no data state)
- Business impact summary
- Action buttons for feedback and reports

## Dependencies

The application requires the following dependencies:

```bash
npm install react-router-dom
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Login**: Navigate to `/login` (default route)
   - Username: `mythree.koyyana`
   - Password: `password123`
   - Click "Login" to access the admin dashboard

2. **Admin Dashboard**: After login, you'll be redirected to `/admin`
   - View key metrics and business insights
   - Navigate using the sidebar icons
   - Access various admin functions

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx      # Login page component
│   └── Admin.jsx      # Admin dashboard component
├── App.jsx            # Main app with routing
├── main.jsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing

## Development

The application uses:
- **Tailwind CSS v4** for styling
- **React Router v6** for navigation
- **Vite** for fast development and building

All components are responsive and follow modern UI/UX practices.
