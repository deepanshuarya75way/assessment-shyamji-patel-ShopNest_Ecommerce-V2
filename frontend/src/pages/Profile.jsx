import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', margin: '100px 20px', color: '#a1a1aa' }}>
        <h2 style={{ color: '#fff', marginBottom: '16px' }}>Please login to view your profile</h2>
        <Link to="/login" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 600 }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ maxWidth: '760px', margin: '50px auto', padding: '0 20px' }}>

      {/* Banner + Avatar */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '70px',
        }}
      >
        <div
          style={{
            height: '140px',
            background:
              'radial-gradient(circle at top right, rgba(249, 115, 22, 0.35), transparent 60%), linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '32px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#fff',
            border: '4px solid #09090b',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          }}
        >
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {user.verified && (
          <div
            style={{
              position: 'absolute',
              bottom: '-42px',
              left: '112px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '3px solid #09090b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Verified account"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Name + Role */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.7rem' }}>{user.name}</h2>
          <p style={{ color: '#71717a', margin: '6px 0 0', fontSize: '14px' }}>{user.email}</p>
        </div>

        <span
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: user.role === 'admin' ? '#fff' : '#f97316',
            background: user.role === 'admin'
              ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
              : 'rgba(249, 115, 22, 0.1)',
            border: user.role === 'admin' ? 'none' : '1px solid rgba(249, 115, 22, 0.3)',
            height: 'fit-content',
          }}
        >
          {user.role || 'user'}
        </span>
      </div>

      {/* Info Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <InfoCard label="Full Name" value={user.name} />
        <InfoCard
          label="Email Address"
          value={user.email}
          action={
            <button onClick={handleCopyEmail} style={copyBtnStyle}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          }
        />
        <InfoCard label="Account Status" value={user.verified ? 'Verified' : 'Not Verified'} valueColor={user.verified ? '#22c55e' : '#f97316'} />
        <InfoCard label="Account Type" value={user.role || 'user'} capitalize />
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <ActionCard
          to="/orders"
          title="My Orders"
          subtitle="Track & view order history"
          icon={
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
          }
        />
        <ActionCard
          to="/cart"
          title="My Cart"
          subtitle="View items in your cart"
          icon={<path d="M3 3h18M6 3l1.68 12.39A2 2 0 009.67 17h6.66a2 2 0 001.99-1.61L20 8H6" />}
        />
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          width: '100%',
          marginTop: '30px',
          padding: '14px 18px',
          background: 'transparent',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        Logout
      </button>
    </div>
  );
};

const InfoCard = ({ label, value, action, valueColor, capitalize }) => (
  <div
    style={{
      background: '#18181b',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}
  >
    <p style={{ color: '#71717a', fontSize: '12px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p
        style={{
          color: valueColor || '#fafafa',
          fontSize: '15px',
          margin: 0,
          fontWeight: 600,
          textTransform: capitalize ? 'capitalize' : 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </p>
      {action}
    </div>
  </div>
);

const ActionCard = ({ to, title, subtitle, icon }) => (
  <Link
    to={to}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: '#18181b',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '18px 20px',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        background: 'rgba(249, 115, 22, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
    </div>
    <div>
      <p style={{ color: '#fafafa', fontSize: '14.5px', fontWeight: 600, margin: 0 }}>{title}</p>
      <p style={{ color: '#71717a', fontSize: '12.5px', margin: '2px 0 0' }}>{subtitle}</p>
    </div>
  </Link>
);

const copyBtnStyle = {
  padding: '4px 10px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#f97316',
  background: 'rgba(249, 115, 22, 0.1)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  flexShrink: 0,
};

export default Profile;