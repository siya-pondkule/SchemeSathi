import React, { useState, useEffect } from "react";
import QuizComponent from "./QuizComponent";
import SchemeRecommendations from "./SchemeRecommendations";
import UserDocuments from "../User/UserDocuments";
import { useNavigate } from "react-router-dom"; // For navigation

const StudentDashboard = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
        Loading student dashboard...
      </div>
    );
  }

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      {/* Profile Icon */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: "10px"
          }}
        >
          <div
            style={{
              background: "#1E40AF",
              color: "#fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "18px"
            }}
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span style={{ fontWeight: "500", color: "#1E40AF" }}>
            {user.name?.split(" ")[0] || "User"}
          </span>
        </div>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "0",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: "10px",
              zIndex: 1002,
              minWidth: "150px"
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "#DC2626",
                fontWeight: "500",
                cursor: "pointer",
                padding: "8px 12px",
                textAlign: "left",
                width: "100%"
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

<h1></h1>
      <SchemeRecommendations />

      {/* Floating Buttons */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 1001
        }}
      >
        <button
          onClick={() => setQuizOpen(true)}
          style={{
            background: "#1E40AF",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            fontSize: "16px"
          }}
        >
          Take Eligibility Quiz
        </button>

        <button
          onClick={() => setUploadOpen(true)}
          style={{
            background: "#059669",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            fontSize: "16px"
          }}
        >
          Upload Documents
        </button>
      </div>

      {/* Quiz Modal */}
      {quizOpen && (
        <div
          style={{
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
          }}
        >
          <QuizComponent setQuizOpen={setQuizOpen} />
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "relative",
              background: "#ffffff",
              padding: "40px 30px",
              borderRadius: "12px",
              minWidth: "600px",
              maxWidth: "800px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              overflow: "visible"
            }}
          >
            <button
              onClick={() => setUploadOpen(false)}
              style={{
                position: "absolute",
                top: "-18px",
                right: "-18px",
                background: "#DC2626",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontSize: "20px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                lineHeight: 1
              }}
            >
              ×
            </button>
            <UserDocuments userId={user.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
