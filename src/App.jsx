import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Appointments from './pages/Appointments'
import './App.css'
import PointOfSale from './components/Apponintments/point_of_sale.jsx'
import PointOfProducts from './components/Apponintments/point_of_products.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/pos" element={<PointOfSale />} />
        <Route path="/products-pos" element={<PointOfProducts />} />
      </Routes>
    </Router>
  )
}

export default App
