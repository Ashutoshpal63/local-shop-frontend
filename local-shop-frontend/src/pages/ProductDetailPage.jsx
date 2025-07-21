// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { FiPlus, FiMinus, FiShoppingCart, FiArrowLeft, FiTag, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated || user.role !== 'customer') {
      toast.error('Please log in as a customer to add items to your cart.');
      return;
    }
    addItem(product._id, quantity);
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold">Product Not Found</h2>
        <p className="text-slate-400 mt-2">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="glow-button inline-flex items-center mt-6">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="glass-card p-4">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/500'} 
            alt={product.name} 
            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">{product.name}</h1>
          
          <div className="flex items-center space-x-4">
            <p className="text-3xl font-bold text-primary flex items-center">
              <FiTag className="mr-2"/> ${product.price.toFixed(2)}
            </p>
            <Link to={`/shops/${product.shopId?._id}`} className="text-slate-400 hover:text-primary transition flex items-center">
                <FiShoppingBag className="mr-1"/> {product.shopId?.name || 'Unknown Shop'}
            </Link>
          </div>

          <p className="text-slate-300 leading-relaxed">{product.description}</p>
          
          <div className="border-t border-slate-700 pt-6">
            <div className="flex items-center space-x-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-700 rounded-lg">
                <button onClick={() => handleQuantityChange(-1)} className="p-3 text-slate-400 hover:text-white transition">
                  <FiMinus />
                </button>
                <span className="px-4 text-lg font-semibold text-white">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-3 text-slate-400 hover:text-white transition">
                  <FiPlus />
                </button>
              </div>
              
              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="glow-button flex-grow flex items-center justify-center text-lg"
              >
                <FiShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This line fixes the error
export default ProductDetailPage;