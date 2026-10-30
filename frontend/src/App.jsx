import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReturnPolicy from './pages/ReturnPolicy';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Shop from './pages/Shop';
import OrderHistory from './pages/OrderHistory';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/return" element={<ReturnPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
