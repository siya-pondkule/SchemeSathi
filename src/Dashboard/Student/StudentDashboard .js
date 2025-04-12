import React, { useState, useEffect } from "react";
import QuizComponent from "./QuizComponent";
import SchemeRecommendations from "./SchemeRecommendations";
import UserDocuments from "../User/UserDocuments";

const StudentDashboard = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
        Loading student dashboard...
      </div>
    );
  }

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <h2 style={{ color: "#1E40AF" }}>Student Dashboard</h2>
      

      <SchemeRecommendations />

      {/* Floating Buttons */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1001
      }}>
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
          <QuizComponent setQuizOpen={setQuizOpen} />
        </div>
      )}

      {/* Upload Modal */}
      {/* Upload Modal */}
{uploadOpen && (
  <div style={{
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
  }}>
    <div style={{
      position: "relative",
      background: "#ffffff",
      padding: "40px 30px",
      borderRadius: "12px",
      minWidth: "600px",
      maxWidth: "800px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      overflow: "visible" // Prevents scrollbars
    }}>
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
