// src/pages/RegisterPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUserPlus, FiMapPin, FiCrosshair } from 'react-icons/fi';
// Import Leaflet components
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import api from '@/api'; // To call our backend for geocoding

// A helper component to move the map when the marker position changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer',
  });
  const [location, setLocation] = useState({
    address: '', city: '', pincode: '', lat: 28.6139, lng: 77.2090
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        toast.success("Location detected!");
        setLocation(prev => ({ ...prev, lat: latitude, lng: longitude, address: "Current Location" }));
      }, () => toast.error("Unable to retrieve your location."));
    }
  };
  
  const handleAddressSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
        const { data } = await api.get('/location/geocode', { params: { address: searchTerm }});
        setLocation(prev => ({
            ...prev,
            lat: data.location.lat,
            lng: data.location.lng,
            address: data.fullAddress || searchTerm,
        }));
    } catch (error) {
        toast.error("Could not find that address.");
    }
  }
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.address) {
        toast.error("Please set your location before registering.");
        return;
    }
    setIsLoading(true);

    const registrationData = {
      ...formData,
      address: {
        street: location.address,
        city: location.city || "N/A", // We may not get city from a simple search
        pincode: location.pincode || "N/A",
        geo: { lat: location.lat, lng: location.lng }
      }
    };

    try {
      await register(registrationData);
      toast.success('Registration successful! Welcome.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Memoize the marker position to prevent re-renders
  const markerPosition = useMemo(() => [location.lat, location.lng], [location.lat, location.lng]);

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-2xl glass-card p-8 space-y-6">
        <div className="text-center">
          <FiUserPlus className="mx-auto text-4xl text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-white">Create an Account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="name">Full Name</label><input id="name" name="name" type="text" required onChange={handleChange} className="mt-1 glow-input" /></div>
            <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required onChange={handleChange} className="mt-1 glow-input" /></div>
            <div><label htmlFor="password">Password</label><input id="password" name="password" type="password" required onChange={handleChange} className="mt-1 glow-input" /></div>
            <div><label htmlFor="role">Register as...</label><select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 glow-input"><option value="customer">Customer</option><option value="shop">Shop Owner</option><option value="delivery">Delivery Agent</option></select></div>
          </div>
          
          <fieldset className="border border-slate-700 p-4 rounded-lg space-y-4">
            <legend className="px-2 text-slate-300 font-semibold flex items-center"><FiMapPin className="mr-2"/> Set Your Location</legend>
            <button type="button" onClick={handleDetectLocation} className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700">
                <FiCrosshair className="mr-2"/> Use my current location
            </button>
            <form onSubmit={handleAddressSearch} className="flex">
                <input type="text" placeholder="Or search for your address" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full glow-input rounded-r-none" />
                <button type="submit" className="glow-button rounded-l-none px-4">Search</button>
            </form>
            <div className="rounded-lg overflow-hidden border border-slate-700 h-[300px]">
              <MapContainer center={markerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={markerPosition} zoom={13} />
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerPosition}></Marker>
              </MapContainer>
            </div>
          </fieldset>
          
          <div><button type="submit" disabled={isLoading} className="w-full glow-button disabled:opacity-50">{isLoading ? 'Registering...' : 'Register'}</button></div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;