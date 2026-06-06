import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { AdminDashboard, AdminFoods, AdminOrders, AdminRestaurants } from './pages/AdminPages';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import RestaurantsPage from './pages/RestaurantsPage';

function Private({ children, admin = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'admin') return <Navigate to="/home" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
        <Route path="/cart" element={<Private><CartPage /></Private>} />
        <Route path="/checkout" element={<Private><CheckoutPage /></Private>} />
        <Route path="/orders" element={<Private><OrdersPage /></Private>} />
        <Route path="/profile" element={<Private><ProfilePage /></Private>} />
        <Route path="/admin" element={<Private admin><AdminDashboard /></Private>} />
        <Route path="/admin/restaurants" element={<Private admin><AdminRestaurants /></Private>} />
        <Route path="/admin/foods" element={<Private admin><AdminFoods /></Private>} />
        <Route path="/admin/orders" element={<Private admin><AdminOrders /></Private>} />
      </Routes>
      <Footer />
    </>
  );
}
