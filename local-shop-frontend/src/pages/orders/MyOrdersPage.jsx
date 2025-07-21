// src/pages/orders/MyOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { FiArchive, FiHash, FiCalendar, FiDollarSign, FiTruck, FiArrowRight } from 'react-icons/fi';

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  accepted: 'text-blue-400 bg-blue-400/10',
  out_for_delivery: 'text-sky-400 bg-sky-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

const OrderItem = ({ order }) => (
  <div className="glass-card p-4 sm:p-6 hover:border-primary/50 transition-colors duration-300">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-700 pb-3 mb-3">
      <div>
        <h3 className="font-bold text-white flex items-center">
          <FiHash className="mr-2"/> Order #{order._id.slice(-8)}
        </h3>
        <p className="text-sm text-slate-400 flex items-center mt-1">
          <FiCalendar className="mr-2"/> {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className={`mt-2 sm:mt-0 text-sm font-semibold py-1 px-3 rounded-full ${statusColors[order.status]}`}>
        {order.status.replace('_', ' ').toUpperCase()}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-center space-x-3">
         {order.products.slice(0, 3).map(p => (
            <img key={p.productId} src={'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded-md object-cover border-2 border-slate-700"/>
         ))}
         {order.products.length > 3 && <div className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">+{order.products.length - 3}</div>}
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-8 mt-4 sm:mt-0">
          <p className="font-bold text-lg text-white flex items-center">
            <FiDollarSign className="mr-1 text-primary"/>{order.totalAmount.toFixed(2)}
          </p>
          <Link to={`/order/track/${order._id}`} className="glow-button py-2 px-4 text-sm mt-3 sm:mt-0 w-full sm:w-auto">
            Track Order
          </Link>
      </div>
    </div>
  </div>
);


const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        // Sort orders by most recent
        const sortedOrders = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FiArchive className="text-4xl text-primary" />
        <h1 className="text-4xl font-bold">My Order History</h1>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => <OrderItem key={order._id} order={order} />)}
        </div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h2 className="text-2xl font-semibold">No Orders Found</h2>
          <p className="text-slate-400 mt-2">You haven't placed any orders yet. Let's change that!</p>
          <Link to="/products" className="glow-button inline-flex items-center mt-6">
            Start Shopping <FiArrowRight className="ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
};

// This line fixes the error
export default MyOrdersPage;