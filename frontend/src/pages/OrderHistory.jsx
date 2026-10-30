import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const statusColors = {
  pending: '#f97316',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', margin: '100px 20px', color: '#a1a1aa' }}>
        <h2 style={{ color: '#fff', marginBottom: '16px' }}>Please login to view your orders</h2>
        <Link to="/login" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 600 }}>
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Orders...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '60px 0', color: '#a1a1aa' }}>
          <p style={{ marginBottom: '20px' }}>You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: '#18181b',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Order ID</p>
                  <p style={{ color: '#fafafa', fontSize: '14px', margin: '4px 0 0' }}>{order._id}</p>
                </div>
                <div>
                  <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Placed On</p>
                  <p style={{ color: '#fafafa', fontSize: '14px', margin: '4px 0 0' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    color: '#fff',
                    background: statusColors[order.status] || '#71717a',
                  }}
                >
                  {order.status || 'pending'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#a1a1aa',
                      fontSize: '14px',
                    }}
                  >
                    <span>
                      {item.productId?.name || item.name || 'Product'} × {item.qty}
                    </span>
                    <span>₹{(item.productId?.price || item.price || 0) * item.qty}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>
                  {order.address?.city}, {order.address?.country}
                </span>
                <span style={{ color: '#f97316', fontSize: '18px', fontWeight: 700 }}>
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
