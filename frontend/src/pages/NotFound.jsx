import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
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
      <h1
        style={{
          fontSize: '7rem',
          fontWeight: 800,
          margin: 0,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </h1>

      <h2 style={{ color: '#fff', marginTop: '10px', marginBottom: '12px' }}>
        Page Not Found
      </h2>

      <p style={{ color: '#a1a1aa', maxWidth: '400px', marginBottom: '30px', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        to="/"
        style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '15px',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
