import React, { useState, useEffect, useRef } from 'react';
import About from './About';  
import Contact from './Contact';
import Services from './Services';

const Home = () => {
  // State to manage the changing slogan
  const [slogan, setSlogan] = useState("Empowering Communities, Transforming Lives");
  const [sloganColor, setSloganColor] = useState("#1e40af"); // Initial color

  // Array of slogans
  const slogans = [
    "Empowering Communities, Transforming Lives",
    "Improving Livelihoods with Government Schemes",
    "Enabling Growth Through Supportive Programs",
    "Building a Better Future for All"
  ];

  // Array of colors for the slogan
  const sloganColors = [
    "#1e40af", // Blue
    "#4caf50", // Green
    "#f97316", // Orange
    "#e11d48", // Red
    "#9333ea", // Purple
    "#f59e0b", // Yellow
  ];

  // Change slogan every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlogan((prevSlogan) => {
        const currentIndex = slogans.indexOf(prevSlogan);
        const nextIndex = (currentIndex + 1) % slogans.length;
        return slogans[nextIndex];
      });
      
      setSloganColor((prevColor) => {
        const currentIndex = sloganColors.indexOf(prevColor);
        const nextIndex = (currentIndex + 1) % sloganColors.length;
        return sloganColors[nextIndex];
      });
    }, 2000); // 2000ms = 2 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [slogans, sloganColors]);

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
    height: '52vh',
    backgroundColor: '#f0f4f8',
    marginTop: '75px',
  };

  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  };

  const leftSideStyle = {
    flex: 1,
    paddingRight: '10px',
  };

  const sloganStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: sloganColor, // Use the dynamic color
    marginBottom: '10px',
    animation: 'fadeIn 2s ease-in-out', // Animation for fading in the slogan
  };

  const descriptionStyle = {
    fontSize: '1.2rem',
    color: '#4b5563',
    lineHeight: '1.6',
  };

  const rightSideStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    animation: 'scaleUp 2s ease-in-out', // Animation for scaling the image
    position: 'relative',
  };

  const imageStyle = {
    width: '350px',
    height: '350px',
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Regular shadow
    transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease', // Transition for smooth effect
  };

  return (
    <div>
      {/* Home Section */}
      <div id="home" style={containerStyle}>
        <div style={contentStyle}>
          <div style={leftSideStyle}>
            <h1 style={sloganStyle}>{slogan}</h1>
            <p style={descriptionStyle}>
              Government schemes play a vital role in ensuring the well-being of citizens by providing
              financial support, health care, education, and more. These initiatives aim to empower individuals,
              improve livelihoods, and uplift the nation as a whole. Explore a wide range of schemes designed to
              cater to your needs and bring about positive change in your life.
            </p>
          </div>
          <div style={rightSideStyle}>
            <img 
              src={require('../Assets/india.jpg')} 
              alt="Government Scheme" 
              style={imageStyle} 
              ref={imageRef}
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" style={{ padding: '40px', backgroundColor: '#f9fafb' }}>
        <About />
      </div>

      {/* Contact Section */}
      <div id="services" style={{ padding: '40px', backgroundColor: '#f9fafb' }}>
        <Services />
      </div>

      {/* Contact Section */}
      <div id="contact" style={{ padding: '40px', backgroundColor: '#f9fafb' }}>
        <Contact />
      </div>

    </div>
  );
};

export default Home;
