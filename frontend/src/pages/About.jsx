import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const paraStyle = {
    color: '#a1a1aa',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    marginBottom: '16px',
  };

  const socialContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '30px',
  };

  const socialLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#27272a',
    color: '#fafafa',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background 0.3s ease',
  };

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>About ShopNest</h1>

      <p style={paraStyle}>
        ShopNest is a premium e-commerce platform built to bring you quality products at unbeatable prices.
        We believe shopping should be simple, fast, and enjoyable — from browsing to checkout.
      </p>

      <p style={paraStyle}>
        Founded with a passion for great design and customer experience, ShopNest is constantly evolving
        to bring you the best in online shopping.
      </p>

      <h3 style={{ color: '#fff', marginTop: '30px', marginBottom: '10px' }}>Connect With Us</h3>

      <div style={socialContainerStyle}>
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            style={socialLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#3f3f46')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#27272a')}
          >
            <span>{social.icon}</span>
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default About;
