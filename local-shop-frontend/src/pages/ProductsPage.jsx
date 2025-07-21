// src/pages/ProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { FiShoppingCart, FiSearch, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

// ProductCard component remains the same
const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated || user.role !== 'customer') {
      toast.error('Please log in as a customer to shop.');
      return;
    }
    addItem(product._id, 1);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="glass-card overflow-hidden h-full flex flex-col justify-between">
        <div className="relative">
          <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
          <div className="absolute top-0 right-0 m-2 bg-slate-900/50 backdrop-blur-sm text-primary font-bold px-2 py-1 rounded-md text-sm">${product.price.toFixed(2)}</div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-sm text-slate-400">{product.shopId.name}</p>
          </div>
          <button onClick={handleAddToCart} className="w-full mt-4 glow-button flex items-center justify-center text-sm py-2">
            <FiShoppingCart className="mr-2"/> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth(); // --- Get the authenticated user

  const page = parseInt(searchParams.get('page') || '1');
  const name = searchParams.get('name') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // --- NEW: Prepare params for the API call ---
      const params = {
        page,
        name,
        limit: 12,
      };

      // If user is logged in and has a location, add it to the params
      if (user?.address?.geo?.lat && user?.address?.geo?.lng) {
        params.latitude = user.address.geo.lat;
        params.longitude = user.address.geo.lng;
        // Optionally add a radius if you want it to be dynamic
        // params.radius = 20; 
      }
      // ---------------------------------------------

      try {
        const { data } = await api.get('/products', { params });
        setProducts(data.data);
        setTotalPages(data.pages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    // We wait for the user object to be loaded before fetching
    if (user !== undefined) {
        fetchProducts();
    }
  }, [page, name, user]); // --- Add user to the dependency array

  const handleSearch = (e) => {
      e.preventDefault();
      const searchTerm = e.target.elements.search.value;
      setSearchParams({ name: searchTerm, page: 1 });
  }

  const handlePageChange = (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setSearchParams({ name, page: newPage });
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Explore Products</h1>
        {user?.address?.city ? (
            <p className="text-slate-400 mt-2 flex items-center justify-center">
                <FiMapPin className="mr-2 text-primary"/> Showing available products near <span className="font-bold text-slate-300 mx-1">{user.address.city}</span>
            </p>
        ) : (
             <p className="text-slate-400 mt-2">Find everything you need from your favorite local shops.</p>
        )}
      </div>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center">
        <input 
            type="text" 
            name="search" 
            defaultValue={name}
            placeholder="Search for products..." 
            className="glow-input rounded-r-none flex-grow"
        />
        <button type="submit" className="glow-button rounded-l-none px-4">
            <FiSearch/>
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
              <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="glow-button disabled:opacity-50">Previous</button>
              <span className="text-white font-semibold">Page {page} of {totalPages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="glow-button disabled:opacity-50">Next</button>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Products Found Nearby</h2>
          <p className="text-slate-400 mt-2">Try searching for something else or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;