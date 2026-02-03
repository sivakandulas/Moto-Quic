import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BikeDetail from './pages/BikeDetail';
import ShopInfo from './pages/ShopInfo';
import Bookings from './pages/Bookings';
import Garage from './pages/Garage';
import Dashboard from './pages/Dashboard';
import ReserveRide from './pages/ReserveRide';
import { AuthProvider } from './context/AuthContext';
import { BikeProvider } from './context/BikeContext';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <BikeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="bikes/:id" element={<BikeDetail />} />
              <Route path="shop-info" element={<ShopInfo />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="garage" element={<Garage />} />
            </Route>

            {/* Standalone Pages (No Bottom Nav) */}
            <Route path="/login" element={<Login />} />
            <Route path="/reserve/:id" element={<ReserveRide />} />

            <Route path="/owner" element={<Layout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BikeProvider>
    </AuthProvider>
  );
}
