import React, { useEffect } from 'react';

const LanguageSwitcher = () => {
  useEffect(() => {
    // Inject global CSS to override Translate banner styles
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame, 
      .goog-logo-link, 
      .goog-te-gadget,
      #goog-gt-tt, 
      .goog-tooltip, 
      .goog-tooltip:hover, 
      .goog-text-highlight,
      #google_translate_element {
        display: none !important;
        height: 0 !important;
        visibility: hidden !important;
      }

      body {
        top: 0px !important;
      }

      .skiptranslate {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Remove iframe & banner multiple times to ensure it's gone
    const hideBanner = () => {
      const bannerFrame = document.querySelector('iframe.goog-te-banner-frame');
      const googleFrame = document.querySelector('iframe[id^=":"]'); // Google sometimes sets dynamic IDs
      const translateElement = document.getElementById('google_translate_element');

      if (bannerFrame) bannerFrame.remove();
      if (googleFrame && googleFrame.style.display !== 'none') googleFrame.style.display = 'none';
      if (translateElement) translateElement.style.display = 'none';

      document.body.style.top = '0px';
    };

    const interval = setInterval(hideBanner, 500);
    setTimeout(() => clearInterval(interval), 5000);
  }, []);

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
        <option value="hi">🌐 🇮🇳 Hindi</option>
        <option value="mr">🌐 🇮🇳 Marathi</option>
        <option value="gu">🌐 🇮🇳 Gujarati</option>
        <option value="bn">🌐 🇮🇳 Bengali</option>
        <option value="te">🌐 🇮🇳 Telugu</option>
        <option value="ta">🌐 🇮🇳 Tamil</option>
        <option value="kn">🌐 🇮🇳 Kannada</option>
        <option value="pa">🌐 🇮🇳 Punjabi</option>
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
