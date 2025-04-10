import React, { useState } from "react";
import QuizComponent from "./QuizComponent";
import SchemeRecommendations from "./SchemeRecommendations";

const StudentDashboard = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <h2>Student Dashboard</h2>
      <SchemeRecommendations />
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
          fontSize: "16px"
        }}
      >Take Eligibility Quiz</button>
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
    </div>
  );
};

export default StudentDashboard;
