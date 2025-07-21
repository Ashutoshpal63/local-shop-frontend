import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/orders/MyOrdersPage';
import TrackOrderPage from './pages/orders/TrackOrderPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CreateShopPage from './pages/shop/CreateShopPage';
import ShopDashboardPage from './pages/shop/ShopDashboardPage';
import AssignedOrdersPage from './pages/delivery/AssignedOrdersPage';


function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />

          {/* Customer Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>
          
          {/* Shop Owner Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['shop']} />}>
            <Route path="shop/create" element={<CreateShopPage />} />
            <Route path="shop/dashboard" element={<ShopDashboardPage />} />
          </Route>
          
          {/* Delivery Agent Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
             <Route path="delivery/orders" element={<AssignedOrdersPage />} />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          {/* Routes for multiple roles */}
           <Route element={<ProtectedRoute allowedRoles={['customer', 'shop', 'delivery', 'admin']} />}>
             <Route path="profile" element={<ProfilePage />} />
             <Route path="order/track/:id" element={<TrackOrderPage />} />
           </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;