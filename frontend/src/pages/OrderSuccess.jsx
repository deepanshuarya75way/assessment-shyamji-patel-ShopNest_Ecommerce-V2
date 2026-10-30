import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.8rem' }}>
        Order Placed Successfully!
      </h1>

      <p style={{ color: '#a1a1aa', maxWidth: '420px', marginBottom: '30px', lineHeight: 1.6 }}>
        Thank you for shopping with ShopNest. Your order has been confirmed and will be
        processed shortly. You can track its status in your order history.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/orders"
          style={{
            padding: '12px 26px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14.5px',
          }}
        >
          View My Orders
        </Link>
        <Link
          to="/shop"
          style={{
            padding: '12px 26px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#a1a1aa',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14.5px',
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
