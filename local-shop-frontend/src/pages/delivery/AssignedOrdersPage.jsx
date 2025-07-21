// src/pages/delivery/AssignedOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { Link } from 'react-router-dom';
import { FiTruck, FiMapPin, FiUser, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const AssignedOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        // This hits the backend route for delivery agents
        const { data } = await api.get('/orders/assigned-orders');
        setOrders(data.data);
      } catch (error) {
        console.error("Failed to fetch assigned orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, []); // The empty array means this effect runs once when the component mounts

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FiTruck className="text-4xl text-primary" />
        <h1 className="text-4xl font-bold">My Assigned Orders</h1>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-300">
              <div>
                <h3 className="font-bold text-lg text-white truncate">Order #{order._id.slice(-6)}</h3>
                <p className="text-sm text-slate-400 mb-4">Status: <span className="font-semibold text-amber-400 capitalize">{order.status.replace('_', ' ')}</span></p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <FiShoppingBag className="mr-3 text-slate-500 flex-shrink-0" />
                    <span>From: <span className="font-semibold text-slate-300">{order.shopId?.name || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-3 text-slate-500 flex-shrink-0" />
                    <span>To: <span className="font-semibold text-slate-300">{order.userId?.name || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-start">
                    <FiMapPin className="mr-3 text-slate-500 mt-1 flex-shrink-0" />
                    <span>Address: <span className="font-semibold text-slate-300">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span></span>
                  </div>
                </div>
              </div>

              <Link to={`/order/track/${order._id}`} className="mt-6 glow-button text-center flex items-center justify-center">
                Track & Update Status <FiArrowRight className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h2 className="text-2xl font-semibold">No active orders assigned.</h2>
          <p className="text-slate-400 mt-2">You're all caught up! Check back later for new deliveries.</p>
        </div>
      )}
    </div>
  );
};

// This is the crucial line that fixes the error
export default AssignedOrdersPage;