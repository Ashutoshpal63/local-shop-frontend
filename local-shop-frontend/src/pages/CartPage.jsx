// src/pages/CartPage.jsx

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Loader from '@/components/common/Loader';

const CartPage = () => {
  const { items, removeItem, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    try {
      // For simplicity, we assume all items are from the same shop.
      const shopId = items[0].productId.shopId;
      const productsForOrder = items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      }));

      const orderData = {
        shopId,
        products: productsForOrder,
        deliveryAddress: user.address,
        paymentMethod: 'card', // or 'cod'
      };

      const { data: newOrderResponse } = await api.post('/orders', orderData);
      const orderId = newOrderResponse.data._id;
      
      // Now, simulate the payment process
      toast.success('Order placed! Processing payment...');
      await api.post('/payment/process-payment', { orderId });

      toast.success('Payment successful! Your order is on its way.');
      clearCart();
      navigate(`/order/track/${orderId}`);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!items) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FiShoppingBag className="text-4xl text-primary" />
        <h1 className="text-4xl font-bold">Your Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
          <p className="text-slate-400 mt-2">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="glow-button inline-flex items-center mt-6">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId._id} className="glass-card p-4 flex items-center space-x-4">
                <img src={item.productId.imageUrl || 'https://via.placeholder.com/100'} alt={item.productId.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">{item.productId.name}</h3>
                  <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                  <p className="text-primary font-bold mt-1">${(item.productId.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeItem(item.productId._id)} className="text-slate-500 hover:text-red-400 transition-colors p-2">
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 glass-card p-6 sticky top-24">
            <h2 className="text-2xl font-bold border-b border-slate-700 pb-4 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-semibold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping</span>
                <span className="text-white font-semibold">Free</span>
              </div>
              <div className="border-t border-slate-700 my-2"></div>
              <div className="flex justify-between text-xl">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full glow-button mt-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'} <FiArrowRight className="ml-2" />
            </button>
            <button onClick={clearCart} className="w-full text-center text-sm text-slate-500 hover:text-red-400 mt-4 transition">
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// This line fixes the error
export default CartPage;