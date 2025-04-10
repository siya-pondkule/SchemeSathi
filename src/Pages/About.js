import React, { useEffect, useRef } from 'react';

const About = () => {
  // Ref to track image position for mouse move effect
  const imageRef = useRef(null);

  // Function to make the image move based on mouse position
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const image = imageRef.current;
    const offsetX = clientX - window.innerWidth / 2;
    const offsetY = clientY - window.innerHeight / 2;

    // Apply movement to the image
    image.style.transform = `translate(${offsetX * 0.05}px, ${offsetY * 0.05}px)`;
  };

  // Adding mousemove event listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40vh',
    backgroundColor: '#f9fafb',
    padding: '20px',

  };

  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    animation: 'fadeIn 1.5s ease-out', // Fade-in animation for the content
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
    paddingRight: '8px',
    justifyContent: 'center',
    animation: 'scaleUp 1.5s ease-out', // Animation for scaling the image
    position: 'relative',
  };

  const rightSideStyle = {
    flex: 1,
    paddingLeft: '20px',
  };

  const imageStyle = {
    width: '350px',
    height: '350px',
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out', // Transition for smooth effect
  };

  const descriptionStyle = {
    fontSize: '1.2rem',
    color: '#4b5563',
    lineHeight: '1.6',
    fontWeight: '400',
    maxWidth: '600px', // Limit paragraph width for better readability
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={leftSideStyle}>
          <img
            src={require('../Assets/about.jpg')}  // Replace with your image
            alt="About Us"
            style={imageStyle}
            ref={imageRef}
          />
        </div>
        <div style={rightSideStyle}>
        <h2 style={headingStyle}>About Us</h2>
          <p style={descriptionStyle}>
            We are a dedicated team committed to empowering individuals and communities through innovative government
            schemes and programs. Our platform aims to simplify the access to various benefits provided by the government,
            helping individuals improve their quality of life. We are here to assist with the application processes, provide
            guidance, and ensure everyone can benefit from these life-changing initiatives. Join us in creating a better
            future for all.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
