const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  // Email not configured (e.g. local review setup): print to server console instead
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n[DEV] Email credentials not set. Message that would be sent:');
    console.log(`To: ${to}\nSubject: ${subject}\n${text}\n`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    return false;
  }
};

module.exports = sendEmail;