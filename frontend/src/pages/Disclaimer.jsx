import React from 'react';

const textualStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '40px',
  background: '#18181b',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  lineHeight: '1.8',
  color: '#a1a1aa',
};

const headingStyle = {
  fontSize: '2.2rem',
  marginBottom: '20px',
  color: '#fff',
};

const subHeadingStyle = {
  fontSize: '1.3rem',
  color: '#f97316',
  marginTop: '24px',
  marginBottom: '10px',
};

const Disclaimer = () => {
  return (
    <div style={textualStyle}>
      <h1 style={headingStyle}>Disclaimer</h1>

      <p>
        The information provided by ShopNest on this website is for general informational
        and shopping purposes only. All information on the site is provided in good faith,
        however we make no representation or warranty of any kind, express or implied,
        regarding the accuracy, adequacy, validity, reliability, availability, or completeness
        of any information on the site.
      </p>

      <h3 style={subHeadingStyle}>Product Information</h3>
      <p>
        Product images, descriptions, and prices are subject to change without notice.
        We strive to display accurate colors and details, but slight variations may occur
        due to screen settings and manufacturing differences.
      </p>

      <h3 style={subHeadingStyle}>External Links</h3>
      <p>
        Our website may contain links to external websites that are not provided or
        maintained by us. We do not guarantee the accuracy, relevance, or completeness
        of any information on these external websites.
      </p>

      <h3 style={subHeadingStyle}>Limitation of Liability</h3>
      <p>
        Under no circumstance shall we have any liability to you for any loss or damage
        of any kind incurred as a result of the use of this site or reliance on any
        information provided on the site.
      </p>
    </div>
  );
};

export default Disclaimer;