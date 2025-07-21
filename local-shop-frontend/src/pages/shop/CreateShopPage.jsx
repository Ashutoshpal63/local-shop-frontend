// src/pages/shop/CreateShopPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiUpload, FiMapPin, FiTag } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const CreateShopPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    street: '',
    city: '',
    pincode: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'logo') {
      setLogoFile(e.target.files[0]);
    } else if (e.target.name === 'coverImage') {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('category', formData.category);
    submissionData.append('location[street]', formData.street);
    submissionData.append('location[city]', formData.city);
    submissionData.append('location[pincode]', formData.pincode);
    
    if (logoFile) {
      submissionData.append('logo', logoFile);
    }
    if (coverImageFile) {
      submissionData.append('coverImage', coverImageFile);
    }

    try {
      await api.post('/shops', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Shop created successfully! You can now add products.');
      // Refetch user to get the updated shop link
      await fetchUser();
      navigate('/shop/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shop.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-2xl glass-card p-8 space-y-6">
        <div className="text-center">
          <FiPlusCircle className="mx-auto text-4xl text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-white">Create Your Shop</h2>
          <p className="mt-2 text-slate-400">Fill in the details to get your shop online.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Shop Name</label>
              <input id="name" name="name" type="text" required onChange={handleChange} className="mt-1 glow-input" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300">Category</label>
              <input id="category" name="category" type="text" required onChange={handleChange} placeholder="e.g., Grocery, Electronics" className="mt-1 glow-input" />
            </div>
          </div>

          <fieldset className="border border-slate-700 p-4 rounded-lg">
            <legend className="px-2 text-slate-300 font-semibold flex items-center"><FiMapPin className="mr-2"/> Location</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-slate-300">Street Address</label>
                  <input id="street" name="street" type="text" required onChange={handleChange} className="mt-1 glow-input" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-300">City</label>
                  <input id="city" name="city" type="text" required onChange={handleChange} className="mt-1 glow-input" />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-slate-300">Pincode</label>
                  <input id="pincode" name="pincode" type="text" required onChange={handleChange} className="mt-1 glow-input" />
                </div>
            </div>
          </fieldset>

          <fieldset className="border border-slate-700 p-4 rounded-lg">
            <legend className="px-2 text-slate-300 font-semibold flex items-center"><FiUpload className="mr-2"/> Images</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-slate-300">Shop Logo</label>
                  <input id="logo" name="logo" type="file" onChange={handleFileChange} className="mt-1 file:glow-button file:border-0 file:rounded-md file:font-semibold file:text-sm text-slate-400" />
                </div>
                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-slate-300">Cover Image</label>
                  <input id="coverImage" name="coverImage" type="file" onChange={handleFileChange} className="mt-1 file:glow-button file:border-0 file:rounded-md file:font-semibold file:text-sm text-slate-400" />
                </div>
            </div>
          </fieldset>
          
          <div>
            <button type="submit" disabled={isLoading} className="w-full glow-button disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Creating Shop...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// This is the line that fixes the error
export default CreateShopPage;