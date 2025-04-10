import React, { useState } from 'react';
import supabase from '../../Supabase/supabase';

const questions = [
  { id: 1, question: "Please select your appropriate age?", options: ["Below 18", "18-35", "36-60", "Above 60"] },
  { id: 2, question: "Please select your monthly income?", options: ["Below ₹10,000", "₹10,000 - ₹50,000", "Above ₹50,000"] },
  { id: 3, question: "Whether you are employed?", options: ["Yes", "No"] },
  { id: 4, question: "Whether you are a student?", options: ["Yes", "No"] },
  { id: 5, question: "Please select your appropriate category?", options: ["SC", "ST", "OBC", "General", "Other"] },
  { id: 6, question: "Do you have a disability?", options: ["Yes", "No"] },
  { id: 7, question: "Whether you are a farmer?", options: ["Yes", "No"] },
  { id: 8, question: "Do you own a business?", options: ["Yes", "No"] },
  { id: 9, question: "Beneficiary of any other government scheme?", options: ["Yes", "No"] },
  { id: 10, question: "Are you a senior citizen?", options: ["Yes", "No"] }
];

const UserQuizComponent = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      console.error("User ID not found. Please log in again.");
      return;
    }

    // Prepare answers to store in Supabase (with correct lowercase column names)
    const { 1: age, 2: income, 3: employment, 4: studentstatus, 5: category, 6: disability, 7: farmer, 8: business, 9: govtscheme, 10: seniorcitizen } = answers;

    // Insert data into Supabase user_data table
    const { data, error } = await supabase
      .from('user_data')
      .upsert([{
        user_id: userId,
        age,          // lowercase field name
        income,       // lowercase field name
        employment,   // lowercase field name
        studentstatus,// lowercase field name
        category,     // lowercase field name
        disability,   // lowercase field name
        farmer,       // lowercase field name
        business,     // lowercase field name
        govtscheme,   // lowercase field name
        seniorcitizen,// lowercase field name
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("❌ Error submitting quiz:", error.message, error.details || error);
      alert("Failed to submit quiz");
    } else {
      console.log("✅ Quiz submitted:", data);
      alert("Quiz submitted successfully!");
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
      width: "500px", textAlign: "center", fontFamily: "Arial, sans-serif"
    }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "15px", right: "20px", background: "transparent", border: "none",
          fontSize: "24px", color: "#888", cursor: "pointer"
        }}
        aria-label="Close Quiz"
      >
        &times;
      </button>

      <h3 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold", color: "#333" }}>User Eligibility Quiz</h3>
      <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "20px", color: "#444" }}>
        {questions[currentQuestion].question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "start", paddingLeft: "80px" }}>
        {questions[currentQuestion].options.map((option) => (
          <label key={option} style={{
            display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "12px",
            fontSize: "16px", color: "#555"
          }}>
            <input
              type="radio"
              name={`question-${questions[currentQuestion].id}`}
              value={option}
              onChange={() => handleSelect(option)}
              checked={answers[questions[currentQuestion].id] === option}
            />
            {option}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "25px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          style={{
            padding: "12px 20px", background: currentQuestion === 0 ? "#ccc" : "#28a745", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px"
          }}
        >
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            style={{
              padding: "12px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px",
              cursor: "pointer", fontSize: "16px"
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px",
              cursor: "pointer", fontSize: "16px"
            }}
          >
            Submit
          </button>
        )}
      </div>

      {submitted && <div style={{ color: "green", marginTop: "20px" }}>Quiz submitted successfully!</div>}
    </div>
  );
};

export default UserQuizComponent;
