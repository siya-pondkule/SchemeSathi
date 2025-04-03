import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaServicestack, FaPhone, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate(); // 👈 Use navigate function

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
    marginRight: "30px",
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
          <span
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#facc15")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
            onClick={() => handleScroll("home")}
          >
            <FaHome /> Home
          </span>
        </li>
        <li style={menuItemStyle}>
          <span
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#facc15")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
            onClick={() => handleScroll("about")}
          >
            <FaInfoCircle /> About Us
          </span>
        </li>
        <li style={menuItemStyle}>
          <span
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#facc15")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
            onClick={() => handleScroll("services")}
          >
            <FaServicestack /> Services
          </span>
        </li>
        <li style={menuItemStyle}>
          <span
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#facc15")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
            onClick={() => handleScroll("contact")}
          >
            <FaPhone /> Contact
          </span>
        </li>
        <li>
          <span
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#facc15")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
            onClick={() => navigate("/signin")} // 👈 Navigate to Sign In page
          >
            <FaSignInAlt /> Sign In
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
      </div>
    </nav>
  );
};

export default Navbar;
