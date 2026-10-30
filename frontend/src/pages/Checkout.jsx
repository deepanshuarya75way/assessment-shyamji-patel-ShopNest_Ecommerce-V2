import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import '../styles/cart.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  // Shown for reference only — the real, trusted total is calculated
  // by the backend from the database, not from this value.
  const displayTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // STEP 1: Ask the backend to create the Razorpay order + a pending
      // order record. Backend recalculates the price itself.
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ items: cartItems, address })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || 'Could not start payment. Please try again.');
        setLoading(false);
        return;
      }

      const { razorpayOrder, key } = orderData;

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ShopNest',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // STEP 2: Send Razorpay's signed response to the backend.
          // The backend verifies the signature and ONLY THEN marks the
          // order paid and decrements stock.
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              alert(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            alert('Something went wrong while verifying your payment.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the Razorpay popup without paying
            setLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
        },
        theme: {
          color: '#f97316'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{displayTotal.toFixed(2)}</h4>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
