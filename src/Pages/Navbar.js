import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaPhone,
  FaSignInAlt,
  FaComments, // 👈 Added chat icon
} from "react-icons/fa";

const Navbar = ({ onChatClick }) => { // 👈 Accepting a prop to handle chat click
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle Hamburger Menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Smooth scroll function
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  // Open chatbot function
  const handleChatClick = () => {
    if (onChatClick) onChatClick(); // 👈 Trigger chatbot opening
    setIsOpen(false); // Close menu after clicking (for mobile)
  };

  const navbarStyle = {
    backgroundColor: "#1E40AF",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
    transition: "all 0.3s ease-in-out",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "10px 30px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "color 0.3s ease",
  };

  const menuStyle = {
    display: isMobile ? "none" : "flex",
    listStyleType: "none",
    margin: 0,
    padding: 0,
  };

  const menuItemStyle = {
    marginRight: "50px",
  };

  const hamburgerStyle = {
    display: isMobile ? "block" : "none",
    cursor: "pointer",
    fontSize: "24px",
    color: "white",
    marginRight: "20px",
  };

  const mobileMenuStyle = {
    display: isOpen ? "flex" : "none",
    flexDirection: "column",
    position: "absolute",
    top: "60px",
    left: 0,
    width: "100%",
    backgroundColor: "#1E40AF",
    padding: "16px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <nav style={navbarStyle}>
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={require("../Assets/flag.jpg")}
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "8px",
            borderRadius: "50px",
          }}
        />
        <a href="#home" style={linkStyle} onClick={() => handleScroll("home")}>
          SchemeSathi
        </a>
      </div>

      {/* Desktop Menu */}
      <ul style={menuStyle}>
        <li style={menuItemStyle}>
          <span style={linkStyle} onClick={() => handleScroll("home")}>
            <FaHome /> Home
          </span>
        </li>
        <li style={menuItemStyle}>
          <span style={linkStyle} onClick={() => handleScroll("about")}>
            <FaInfoCircle /> About Us
          </span>
        </li>
        <li style={menuItemStyle}>
          <span style={linkStyle} onClick={() => handleScroll("services")}>
            <FaServicestack /> Services
          </span>
        </li>
        <li style={menuItemStyle}>
          <span style={linkStyle} onClick={() => handleScroll("contact")}>
            <FaPhone /> Contact
          </span>
        </li>
        <li style={menuItemStyle}>
          <span style={linkStyle} onClick={() => navigate("/signin")}>
            <FaSignInAlt /> Sign In
          </span>
        </li>
        <li>
        <span
  style={{
    ...linkStyle,
    fontWeight: "bold",
    fontSize: "15px",
    padding: "10px 20px",
    marginRight:"25px",
    borderRadius: "25px",
    backgroundColor: "#facc15", // Attractive yellow button
    color: "#1E40AF", // Dark blue text for contrast
    display: "flex",
    alignItems: "center",
    gap: "5px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#eab308")} // Darker yellow on hover
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#facc15")}
  onClick={handleChatClick}
>
  <FaComments style={{ fontSize: "22px" }} /> Chat with Me
</span>

        </li>
      </ul>

      {/* Hamburger Menu (Mobile) */}
      <div style={hamburgerStyle} onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Dropdown Menu */}
      <div style={mobileMenuStyle}>
        <span style={linkStyle} onClick={() => handleScroll("home")}>
          <FaHome /> Home
        </span>
        <span style={linkStyle} onClick={() => handleScroll("about")}>
          <FaInfoCircle /> About Us
        </span>
        <span style={linkStyle} onClick={() => handleScroll("services")}>
          <FaServicestack /> Services
        </span>
        <span style={linkStyle} onClick={() => handleScroll("contact")}>
          <FaPhone /> Contact
        </span>
        <span style={linkStyle} onClick={() => navigate("/signin")}>
          <FaSignInAlt /> Sign In
        </span>
        <span style={linkStyle} onClick={handleChatClick}>
          <FaComments /> Chat with Me
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
