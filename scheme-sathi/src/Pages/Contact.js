import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const form = useRef();
  const [messageSent, setMessageSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_skq38tb', 'template_qjnur9b', form.current, {
        publicKey: 'M_CuetWd3xXbPZZFM',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setMessageSent(true);
          setTimeout(() => {
            setMessageSent(false);
          }, 3000);
          form.current.reset(); // Clear form
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    maxWidth: '900px',
    margin: 'auto',
    padding: '40px',
    backgroundColor: '#f0f4f8',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    background: "linear-gradient(to bottom right, #e0f2fe, #f8fafc)",
    borderRadius: '10px',
    marginTop: '2px'
  };

  const headingStyle = {
    marginTop: '-35px',
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: "10px",
  };

  const leftSideStyle = {
    flex: 1,
    textAlign: 'left',
  };

  const rightSideStyle = {
    flex: 1,
  };

  const iconContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    color: '#1e40af',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const socialIconsStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '80%',
  };

  const buttonStyle = {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    width: '80%'
  };

  return (
    <div style={containerStyle}>
      {/* Left Side - Contact Info */}
      <div style={leftSideStyle}>
        <h2 style={headingStyle}>Contact Us</h2>
        <div style={iconContainerStyle}>
          <p style={iconStyle}><FaPhone /> +91 1234567890</p>
          <p style={iconStyle}><FaEnvelope /> techinnovators2026@gmail.com</p>
          <p style={iconStyle}><FaMapMarkerAlt /> WCE, Sangli</p>
        </div>

        <div style={socialIconsStyle}>
          <FaFacebook style={{ ...iconStyle, fontSize: '24px' }} />
          <FaTwitter style={{ ...iconStyle, fontSize: '24px' }} />
          <FaLinkedin style={{ ...iconStyle, fontSize: '24px' }} />
        </div>
      </div>

      {/* Right Side - EmailJS Form */}
      <div style={rightSideStyle}>
        <form ref={form} onSubmit={sendEmail} style={formStyle}>
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            style={inputStyle}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Send</button>
        </form>
        {messageSent && <p style={{ color: 'green', marginTop: '10px' }}>Message Sent Successfully!</p>}
      </div>
    </div>
  );
};

export default Contact;
