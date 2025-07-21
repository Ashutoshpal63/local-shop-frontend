import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loader from "@/components/common/Loader"; // Correct
import React from 'react'; // <-- ADD THIS LINE

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, fetchUser } = useAuth();
  const location = useLocation();

  // This effect handles the case where the page is reloaded.
  // The user info might be in localStorage but not yet in the state.
  React.useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser();
    }
  }, [isAuthenticated, user, fetchUser]);
  
  if (isAuthenticated === null) {
      // Still checking auth state
      return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!user) {
    // If authenticated but user object is not loaded yet
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the required role
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;