import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setInfo('A new OTP has been sent to your email.');
      } else {
        setError(data.message || 'Could not resend OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Verify Your Email</h2>
      <p>Enter the 6-digit code we sent to your email.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {info && <p style={{ color: 'green' }}>{info}</p>}

      <form onSubmit={handleVerify}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <p>
        Didn't get the code?{' '}
        <button type="button" onClick={handleResend} disabled={resending} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', textDecoration: 'underline' }}>
          {resending ? 'Sending...' : 'Resend OTP'}
        </button>
      </p>
    </div>
  );
};

export default VerifyOtp;
