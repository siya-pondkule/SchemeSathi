import React, { useState, useEffect } from "react";
import UserQuizComponent from "./UserQuizComponent.js";
import SchemeRecommendations from "./SchemeRecommendations.js";
// Adjust path if needed
//import SchemeRecommendations from "./SchemeRecommendations"; // Import your recommendation component if available

const Users = () => {
  const [user, setUser] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>User Dashboard</h2>
      {user ? (
        <>
          <p style={{ textAlign: "center" }}>Welcome, {user.email}</p>
          
          {/* Add your recommendation component here if needed */}
          <SchemeRecommendations/>

          {/* Floating Quiz Button */}
          <button 
            onClick={() => setQuizOpen(true)}
            style={{ 
              position: "fixed", 
              bottom: "20px", 
              right: "20px", 
              background: "#1E40AF", 
              color: "#fff", 
              padding: "12px 20px", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer", 
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              fontSize: "16px",
              zIndex: 1001
            }}
          >
            Take Eligibility Quiz
          </button>

          {/* Quiz Modal */}
          {quizOpen && (
            <div style={{
              position: "fixed", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100vh", 
              background: "rgba(0, 0, 0, 0.5)", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              zIndex: 1000
            }}>
              <UserQuizComponent onClose={() => setQuizOpen(false)} />
            </div>
          )}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>Loading...</p>
      )}
    </div>
  );
};

export default Users;
