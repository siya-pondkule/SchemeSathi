import React, { useState } from "react";
import supabase from '../../Supabase/supabase';

const quizQuestions = [
  { id: 1, question: "Please select your respective age group", options: ["Below 18", "18-35", "36-60", "Above 60"] },
  { id: 2, question: "Please select your appropriate geneder", options: ["Male", "Female", "Other"] },
  { id: 3, question: "Please select your appropriate category", options: ["General", "SC", "ST", "OBC", "Other"] },
  { id: 4, question: "Are you currently a student?", options: ["Yes", "No"] },
  { id: 5, question: "What is your highest level of education?", options: ["Primary School", "High School", "Undergraduate", "Postgraduate", "Vocational Training"] },
  { id: 6, question: "What is your monthly household income?", options: ["Below ₹10,000", "₹10,000 - ₹50,000", "Above ₹50,000"] },
];

const QuizComponent = ({ setQuizOpen }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const user = JSON.parse(localStorage.getItem("user")); 
  const studentId = user?.id;

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [quizQuestions[currentQuestion].id]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const student_id = user?.id;
  
    if (!student_id) {
      console.error("User ID not found. Please log in again.");
      return;
    }
  
    if (Object.keys(answers).length < quizQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
  
    const { 1: Age_Group, 2: Gender, 3: Category, 4: Student_Status, 5: Education_Level, 6: Household_Income } = answers;
  
    // Step 1: Check if a record for this student already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('student_data')
      .select('*')
      .eq('student_id', student_id)
      .single();  // Expect at most one record
  
    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows" error
      console.error("❌ Error checking existing quiz data:", fetchError.message);
      alert("Failed to check existing quiz data");
      return;
    }
  
    if (existingData) {
      // Step 2: Update the existing record
      const { error: updateError } = await supabase
        .from('student_data')
        .update({
          Age_Group,
          Gender,
          Category,
          Student_Status,
          Education_Level,
          Household_Income,
        })
        .eq('student_id', student_id);
  
      if (updateError) {
        console.error("❌ Error updating quiz:", updateError.message);
        alert("Failed to update quiz");
      } else {
        console.log("✅ Quiz updated");
        alert("Quiz updated successfully!");
        setQuizOpen(false);
      }
    } else {
      // Step 3: Insert new record
      const { error: insertError } = await supabase
        .from('student_data')
        .insert([
          {
            student_id,
            Age_Group,
            Gender,
            Category,
            Student_Status,
            Education_Level,
            Household_Income,
          },
        ]);
  
      if (insertError) {
        console.error("❌ Error inserting quiz:", insertError.message);
        alert("Failed to submit quiz");
      } else {
        console.log("✅ Quiz submitted");
        alert("Quiz submitted successfully!");
        setQuizOpen(false);
      }
    }
  };
  
  

  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
      width: "500px", textAlign: "center", fontFamily: "Arial, sans-serif"
    }}>
      <button
        onClick={() => setQuizOpen(false)}
        style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          background: "transparent",
          border: "none",
          fontSize: "24px",
          color: "#888",
          cursor: "pointer",
        }}
        aria-label="Close Quiz"
      >
        &times;
      </button>

      <h3 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold", color: "#333" }}>Eligibility Quiz</h3>
      <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "20px", color: "#444" }}>
        {quizQuestions[currentQuestion].question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "start", paddingLeft: "80px" }}>
        {quizQuestions[currentQuestion].options.map((option) => (
          <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "12px", fontSize: "16px", color: "#555" }}>
            <input
              type="radio"
              name={`question-${quizQuestions[currentQuestion].id}`}
              value={option}
              onChange={() => handleSelect(option)}
              checked={answers[quizQuestions[currentQuestion].id] === option}
            />
            {option}
          </label>
        ))}
      </div>
      <div style={{ marginTop: "25px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          style={{ padding: "12px 20px", background: currentQuestion === 0 ? "#ccc" : "#28a745", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
        >
          Previous
        </button>
        {currentQuestion < quizQuestions.length - 1 ? (
          <button
            onClick={handleNext}
            style={{ padding: "12px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{ padding: "12px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;