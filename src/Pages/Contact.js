import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [messageSent, setMessageSent] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", formData);
    setMessageSent(true);

    // Clear form after submission
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setMessageSent(false);
    }, 3000);
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
    borderRadius: '10px',
    marginTop: '-30px'
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

        {/* Social Media Icons */}
        <div style={socialIconsStyle}>
          <FaFacebook style={{ ...iconStyle, fontSize: '24px' }} />
          <FaTwitter style={{ ...iconStyle, fontSize: '24px' }} />
          <FaLinkedin style={{ ...iconStyle, fontSize: '24px' }} />
        </div>
      </div>

      {/* Right Side - Feedback Form */}
      <div style={rightSideStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={inputStyle} 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={inputStyle} 
          />
          <textarea 
            name="message" 
            placeholder="Your Message" 
            rows="4" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            style={inputStyle} 
          />
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>

        {/* Success Message */}
        {messageSent && <p style={{ color: 'green', marginTop: '10px' }}>Feedback Sent Successfully!</p>}
      </div>
    </div>
  );
};

export default Contact;
