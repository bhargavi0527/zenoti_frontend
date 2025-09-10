import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Appointments from './pages/Appointments'
import Master from './pages/Master'
import './App.css'
import PointOfSale from './components/Apponintments/point_of_sale.jsx'
import PointOfProducts from './components/Apponintments/point_of_products.jsx'
import ServiceMaster from './components/Masters/service.jsx'
import ProductsMaster from './components/Masters/products.jsx'
import GuestLanding from './pages/Guest.jsx'
import GuestProfile from './pages/GuestProfile.jsx'
import ServiceCustomData from './pages/ServiceCustomData.jsx'
import ClientProfileForm from './pages/ClientProfileForm.jsx'
import SkinHairAnalysis from './pages/SkinHairAnalysis.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/master" element={<Master />} />
        <Route path="/master/services" element={<ServiceMaster />} />
        <Route path="/master/products" element={<ProductsMaster />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/guest" element={<GuestLanding />} />
        <Route path="/guest-profile/:guestId" element={<GuestProfile />} />
        <Route path="/service-custom-data" element={<ServiceCustomData />} />
        <Route path="/client-profile-form" element={<ClientProfileForm />} />
        <Route path="/skin-hair-analysis" element={<SkinHairAnalysis />} />
        <Route path="/pos" element={<PointOfSale />} />
        <Route path="/products-pos" element={<PointOfProducts />} />
      </Routes>
    </Router>
  )
}

export default App
