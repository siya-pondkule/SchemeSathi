import React, { useState, useEffect, useRef } from 'react';
import About from './About';  
import Contact from './Contact';
import Services from './Services';
import Chatbot from '../Chatbot/Chatbot';

const Home = () => {
  const [slogan, setSlogan] = useState("Empowering Communities, Transforming Lives");
  const [sloganColor, setSloganColor] = useState("#1e40af");
  const [showChatbot, setShowChatbot] = useState(false); // Toggle chatbot

  const slogans = [
    "Empowering Communities, Transforming Lives",
    "Improving Livelihoods with Government Schemes",
    "Enabling Growth Through Supportive Programs",
    "Building a Better Future for All"
  ];

  const sloganColors = ["#1e40af", "#4caf50", "#f97316", "#e11d48", "#9333ea", "#f59e0b"];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlogan((prev) => slogans[(slogans.indexOf(prev) + 1) % slogans.length]);
      setSloganColor((prev) => sloganColors[(sloganColors.indexOf(prev) + 1) % sloganColors.length]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const imageRef = useRef(null);
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const image = imageRef.current;
    const offsetX = clientX - window.innerWidth / 2;
    const offsetY = clientY - window.innerHeight / 2;
    image.style.transform = `translate(${offsetX * 0.05}px, ${offsetY * 0.05}px)`;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div>
      <div id="home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '52vh', backgroundColor: '#f0f4f8', marginTop: '75px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
          <div style={{ flex: 1, paddingRight: '10px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: sloganColor, marginBottom: '10px' }}>{slogan}</h1>
            <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: '1.6' }}>
              Government schemes play a vital role in ensuring the well-being of citizens by providing financial support, health care, education, and more.
              These initiatives aim to empower individuals, improve livelihoods, and uplift the nation as a whole.
            </p>
            <button 
              onClick={() => setShowChatbot(true)} 
              style={{ padding: '10px 20px', fontSize: '1rem', color: 'white', backgroundColor: '#1e40af', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}
            >
              Chat with Me
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <img src={require('../Assets/india.jpg')} alt="Government Scheme" style={{ width: '350px', height: '350px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} ref={imageRef} />
          </div>
        </div>
      </div>

      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}

      <div id="about" style={{ padding: '40px', backgroundColor: '#f9fafb' }}><About /></div>
      <div id="services" style={{ padding: '40px', backgroundColor: '#f9fafb' }}><Services /></div>
      <div id="contact" style={{ padding: '40px', backgroundColor: '#f9fafb' }}><Contact /></div>
    </div>
  );
};

export default Home;
