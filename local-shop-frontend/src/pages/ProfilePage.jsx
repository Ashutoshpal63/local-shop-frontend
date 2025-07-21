// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiUpload } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    pincode: user?.address?.pincode || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('phone', formData.phone);
    submissionData.append('address[street]', formData.street);
    submissionData.append('address[city]', formData.city);
    submissionData.append('address[pincode]', formData.pincode);
    
    if (avatarFile) {
        submissionData.append('avatar', avatarFile);
    }
    
    try {
      await api.put('/users/me', submissionData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          }
      });
      toast.success('Profile updated successfully!');
      // Refetch user to update the state everywhere
      await fetchUser(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return null; // Or a loader
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=0284c7&color=fff`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-primary"
        />
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-slate-400 capitalize">{user.role} Account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-4">Edit Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="mt-1 glow-input" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email (cannot be changed)</label>
            <input id="email" name="email" type="email" value={formData.email} disabled className="mt-1 glow-input bg-slate-800/50 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Phone</label>
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="mt-1 glow-input" />
          </div>
        </div>
        
        <fieldset className="border border-slate-700 p-4 rounded-lg">
            <legend className="px-2 text-slate-300 font-semibold flex items-center"><FiMapPin className="mr-2"/> Address</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-slate-300">Street Address</label>
                  <input id="street" name="street" type="text" value={formData.street} onChange={handleChange} className="mt-1 glow-input" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-300">City</label>
                  <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className="mt-1 glow-input" />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-slate-300">Pincode</label>
                  <input id="pincode" name="pincode" type="text" value={formData.pincode} onChange={handleChange} className="mt-1 glow-input" />
                </div>
            </div>
        </fieldset>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-slate-300">Update Avatar</label>
          <input id="avatar" name="avatar" type="file" onChange={handleFileChange} className="mt-1 file:glow-button file:border-0 file:rounded-md file:font-semibold file:text-sm text-slate-400" />
        </div>
        
        <div className="pt-4">
            <button type="submit" disabled={isLoading} className="glow-button flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
              <FiSave className="mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
};

// This line fixes the error
export default ProfilePage;