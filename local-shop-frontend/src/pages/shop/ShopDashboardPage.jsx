// src/pages/shop/ShopDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { FiShoppingBag, FiPlus, FiEdit, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShopDashboardPage = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopData = async () => {
      if (!user?.shop) {
        // If the user is a shop owner but has no shop yet, redirect to create one.
        if (user && user.role === 'shop') {
          navigate('/shop/create');
        }
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/shops/${user.shop}`);
        setShop(data.data);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    if(user) { // Only run if user object is loaded
        fetchShopData();
    }
  }, [user, navigate]);

  const handleDeleteProduct = async (productId) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        // Refresh shop data
        const { data } = await api.get(`/shops/${user.shop}`);
        setShop(data.data);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product.');
      }
    }
  }

  if (loading) return <Loader />;

  if (!shop) {
    return (
        <div className="text-center py-16 glass-card">
          <FiAlertCircle className="mx-auto text-5xl text-yellow-400 mb-4" />
          <h2 className="text-2xl font-semibold">No Shop Found</h2>
          <p className="text-slate-400 mt-2">You haven't created a shop yet. Let's get started!</p>
          <Link to="/shop/create" className="glow-button inline-flex items-center mt-6">
            <FiPlus className="mr-2"/> Create Your Shop
          </Link>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-4">
            <img src={shop.logoUrl || 'https://via.placeholder.com/80'} alt={shop.name} className="w-20 h-20 rounded-full border-4 border-primary"/>
            <div>
              <h1 className="text-4xl font-bold">{shop.name}</h1>
              <p className="text-slate-400">{shop.category}</p>
            </div>
        </div>
        {/* We can add an edit shop button here later */}
      </div>

      {/* Product Management Section */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Products</h2>
            {/* Link to create product page - to be created */}
            <Link to="/shop/products/create" className="glow-button flex items-center">
                <FiPlus className="mr-2"/> Add Product
            </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shop.products && shop.products.length > 0 ? (
                shop.products.map(product => (
                  <tr key={product._id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-white">{product.name}</td>
                    <td className="p-3">${product.price.toFixed(2)}</td>
                    <td className="p-3">{product.quantityAvailable}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-400 hover:text-blue-300"><FiEdit/></button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-400 hover:text-red-300"><FiTrash2/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-slate-400">You haven't added any products yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// This line fixes the error
export default ShopDashboardPage;