import React, { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { FiShoppingCart, FiUser, FiLogOut, FiLogIn, FiBox } from 'react-icons/fi';
import Logo from "@/assets/logo.svg";
import ThemeToggle from '../common/ThemeToggle'; 

const NavLinks = ({ role }) => {
  return (
    <div className="flex items-center space-x-4">
      <NavLink to="/products" className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>Products</NavLink>
      {role === 'admin' && <NavLink to="/admin/dashboard" className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>Dashboard</NavLink>}
      {role === 'shop' && <NavLink to="/shop/dashboard" className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>My Shop</NavLink>}
      {role === 'delivery' && <NavLink to="/delivery/orders" className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>My Deliveries</NavLink>}
      {role === 'customer' && <NavLink to="/my-orders" className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>My Orders</NavLink>}
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items, toggleCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      fetchCart();
    }
  }, [isAuthenticated, user, fetchCart]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
  <img src={Logo} alt="BazarYo Logo" className="h-8 w-8" />
  <span className="text-xl font-bold text-white tracking-wider">BazarYo</span>
</Link>

          <div className="hidden md:flex">
            <NavLinks role={user?.role} />
          </div>

          <div className="flex items-center space-x-4">
             {isAuthenticated && user?.role === 'customer' && (
              <button onClick={toggleCart} className="relative text-2xl text-slate-300 hover:text-primary transition-colors">
                <FiShoppingCart />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs font-bold text-slate-900">
                    {items.length}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-slate-300 hover:text-primary transition-colors">
                  <FiUser className="text-2xl" />
                  <span className="hidden md:inline">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 w-full text-left">
                    <FiUser className="mr-2" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 w-full text-left">
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                 <Link to="/login" className="flex items-center glow-button-secondary py-2 px-4 rounded-lg transition-colors">
                    <FiLogIn className="mr-2" /> Login
                </Link>
                <Link to="/register" className="glow-button py-2 px-4 rounded-lg">
                    Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;