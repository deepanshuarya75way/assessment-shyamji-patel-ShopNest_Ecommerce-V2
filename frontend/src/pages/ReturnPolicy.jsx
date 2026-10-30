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

const ReturnPolicy = () => {
  return (
    <div style={textualStyle}>
      <h1 style={headingStyle}>Return Policy</h1>

      <p>
        At ShopNest, customer satisfaction is our top priority. If you are not completely
        satisfied with your purchase, we're here to help with an easy and transparent
        return process.
      </p>

      <h3 style={subHeadingStyle}>Return Window</h3>
      <p>
        You have 7 days from the date of delivery to request a return. After this period,
        we unfortunately cannot offer a refund or exchange.
      </p>

      <h3 style={subHeadingStyle}>Eligibility for Returns</h3>
      <p>
        To be eligible for a return, your item must be unused, in the same condition
        that you received it, and in its original packaging with all tags intact.
      </p>

      <h3 style={subHeadingStyle}>Non-Returnable Items</h3>
      <p>
        Certain items such as perishable goods, personal care products, and items marked
        as final sale cannot be returned.
      </p>

      <h3 style={subHeadingStyle}>Refund Process</h3>
      <p>
        Once your return is received and inspected, we will notify you of the approval
        or rejection of your refund. If approved, your refund will be processed within
        5-7 business days to your original payment method.
      </p>

      <h3 style={subHeadingStyle}>How to Initiate a Return</h3>
      <p>
        To start a return, please contact our support team with your order number and
        reason for return. We will guide you through the next steps.
      </p>
    </div>
  );
};

export default ReturnPolicy;