import React from 'react';

const LanguageSwitcher = () => {
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    const selectElem = document.querySelector(".goog-te-combo");
    if (selectElem) {
      selectElem.value = lang;
      selectElem.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div style={languageSwitcherStyle}>
      <select onChange={handleLanguageChange} style={selectStyle}>
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
    </div>
  );
};

const languageSwitcherStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#1E40AF",
  padding: "16px 0",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000,
};

const selectStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "bold",
  backgroundColor: "#facc15",
  color: "#1E40AF",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s ease",
};

export default LanguageSwitcher;
