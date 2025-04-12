import React, { useState, useEffect } from "react";
import UserQuizComponent from "./UserQuizComponent.js";
import SchemeRecommendations from "./SchemeRecommendations.js";
import UserDocuments from "./UserDocuments";

const Users = () => {
  const [user, setUser] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [showDocumentsPage, setShowDocumentsPage] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  if (showDocumentsPage) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#1E40AF" }}>Upload Your Documents</h2>
        <button
          onClick={() => setShowDocumentsPage(false)}
          style={{
            marginBottom: "20px",
            marginTop: "50px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "15px 20px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ⬅ Back to Dashboard
        </button>
        <UserDocuments userId={user?.id} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>User Dashboard</h2>

      {/* Profile Icon and Dropdown */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
          alt="Profile Icon"
          style={{ width: 40, height: 40, cursor: "pointer", borderRadius: "50%" }}
          onClick={() => setShowProfileDropdown(prev => !prev)}
        />
        {showProfileDropdown && user && (
          <div style={{
            position: "absolute",
            top: 50,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 1002
          }}>
            <p><strong>Email:</strong> {user.email}</p>
            <button
              onClick={() => {
                setShowFullProfile(true);
                setShowProfileDropdown(false);
              }}
              style={{
                marginTop: "10px",
                background: "#1E40AF",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              View Full Profile
            </button>
          </div>
        )}
      </div>

      {user ? (
        <>
          <p style={{ textAlign: "center" }}>Welcome, {user.email}</p>

          <SchemeRecommendations />

          {/* Document Submission Button */}
          <button
            onClick={() => setShowDocumentsPage(true)}
            style={{
              position: "fixed",
              bottom: "80px",
              right: "20px",
              background: "#059669",
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
            Submit Documents
          </button>

          {/* Eligibility Quiz Button */}
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

          {/* Full Profile Modal */}
          {showFullProfile && (
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
              zIndex: 1003
            }}>
              <div style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                width: "400px",
                textAlign: "center"
              }}>
                <h3 style={{ color: "#1E40AF" }}>User Profile</h3>
                <p><strong>Name:</strong> {user.name || "N/A"}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {user.mobile || "N/A"}</p>
                <p><strong>Hostel Block:</strong> {user.hostelBlock || "N/A"}</p>
                <p><strong>Room Number:</strong> {user.roomNumber || "N/A"}</p>
                <button
                  onClick={() => setShowFullProfile(false)}
                  style={{
                    marginTop: "20px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
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
