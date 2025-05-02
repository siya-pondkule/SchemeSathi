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
  FaComments,
  FaUserCircle,
  FaSignOutAlt,
  FaGlobe,
} from "react-icons/fa";

const Navbar = ({ onChatClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser(loggedInUser);
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    const selectElem = document.querySelector(".goog-te-combo");
    if (selectElem) {
      selectElem.value = lang;
      selectElem.dispatchEvent(new Event("change"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  const handleChatClick = () => {
    if (onChatClick) onChatClick();
    setIsOpen(false);
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
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
    transition: "all 0.3s ease-in-out",
  };

  const profileDropdownStyle = {
    position: "absolute",
    top: "70px",
    right: "20px",
    backgroundColor: "white",
    color: "#1E40AF",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    padding: "10px",
    zIndex: 1001,
    width: "160px",
  };

  const renderLinks = () => (
    <>
      {[
        { icon: <FaHome />, label: "Home", id: "home" },
        { icon: <FaInfoCircle />, label: "About Us", id: "about" },
        { icon: <FaServicestack />, label: "Services", id: "services" },
        { icon: <FaPhone />, label: "Contact", id: "contact" },
      ].map(({ icon, label, id }) => (
        <li key={id} style={{ marginRight: "30px" }}>
          <span
            style={{ ...linkStyle }}
            onClick={() => handleScroll(id)}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#facc15")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
          >
            {icon} {label}
          </span>
        </li>
      ))}
    </>
  );

  return (
    <nav style={navbarStyle}>
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          navigate("/");
          handleScroll("home");
        }}
      >
        <img
          src={require("../Assets/logo.jpeg")}
          alt="Logo"
          style={{
            width: "50px",
            height: "50px",
            marginRight: "8px",
            borderRadius: "50px",
            border: "2px solid #facc15",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <span style={{ ...linkStyle, fontSize: "20px", fontWeight: "900", padding: 0 }}>
          SchemeSathi
        </span>
      </div>
  
      {/* Hamburger icon for mobile */}
      <div
        style={{
          display: isMobile ? "block" : "none",
          color: "white",
          fontSize: "24px",
          zIndex: 1001,
        }}
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
  
      {/* Desktop Menu */}
      <ul
        style={{
          display: isMobile ? "none" : "flex",
          listStyle: "none",
          alignItems: "center",
          margin: 0,
          padding: 0,
          gap: "10px",
        }}
      >
        {renderLinks()}
        <li>
          <span
            style={{
              ...linkStyle,
              fontWeight: "bold",
              fontSize: "15px",
              padding: "10px 20px",
              borderRadius: "25px",
              backgroundColor: "#facc15",
              color: "#1E40AF",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eab308")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#facc15")}
            onClick={handleChatClick}
          >
            <FaComments style={{ fontSize: "22px" }} /> Chat with Me
          </span>
        </li>
  
        {/* Language Selector */}
        <li>
          <select
            onChange={handleLanguageChange}
            style={{
              backgroundColor: "#1E40AF",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <option value="en">🌐 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="mr">🇮🇳 Marathi</option>
            <option value="gu">🇮🇳 Gujarati</option>
            <option value="bn">🇮🇳 Bengali</option>
            <option value="te">🇮🇳 Telugu</option>
            <option value="ta">🇮🇳 Tamil</option>
            <option value="kn">🇮🇳 Kannada</option>
            <option value="pa">🇮🇳 Punjabi</option>
          </select>
        </li>
  
        {/* SignIn / Profile */}
        {user ? (
          <li style={{ position: "relative" }}>
            <span style={linkStyle} onClick={() => setShowDropdown(!showDropdown)}>
              <FaUserCircle /> {user.name}
            </span>
            {showDropdown && (
              <div style={profileDropdownStyle}>
                <p style={{ margin: "8px 0", fontWeight: "bold" }}>{user.email}</p>
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingTop: "8px",
                    color: "#ef4444",
                  }}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </li>
        ) : (
          <li>
            <span
              style={linkStyle}
              onClick={() => navigate("/signin")}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#facc15")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              <FaSignInAlt /> Sign In
            </span>
          </li>
        )}
      </ul>
  
      {/* Mobile Dropdown */}
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            width: "100%",
            backgroundColor: "#1E40AF",
            padding: "16px",
            listStyle: "none",
            zIndex: 999,
          }}
        >
          {renderLinks()}
          <li>
            <span style={linkStyle} onClick={handleChatClick}>
              <FaComments /> Chat with Me
            </span>
          </li>
          <li style={{ marginBottom: "12px" }}>
            <select
              onChange={handleLanguageChange}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                backgroundColor: "#facc15",
                color: "#1E40AF",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <option value="en">🌐 English</option>
              <option value="hi">🇮🇳 Hindi</option>
              <option value="mr">🇮🇳 Marathi</option>
              <option value="gu">🇮🇳 Gujarati</option>
              <option value="bn">🇮🇳 Bengali</option>
              <option value="te">🇮🇳 Telugu</option>
              <option value="ta">🇮🇳 Tamil</option>
              <option value="kn">🇮🇳 Kannada</option>
              <option value="pa">🇮🇳 Punjabi</option>
            </select>
          </li>
          {user ? (
            <>
              <li>
                <span style={linkStyle}>
                  <FaUserCircle /> {user.name}
                </span>
              </li>
              <li>
                <span style={{ ...linkStyle, color: "#ef4444" }} onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </span>
              </li>
            </>
          ) : (
            <li>
              <span style={linkStyle} onClick={() => navigate("/signin")}>
                <FaSignInAlt /> Sign In
              </span>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
  
};

export default Navbar;
