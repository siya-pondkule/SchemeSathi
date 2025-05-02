import React, { useEffect, useState } from "react";
import supabase from "../../Supabase/supabase";

function normalizeStudentResponse(student) {
  const eligibilityTags = [];

  // Normalize gender
  if (student.Gender === "Female") eligibilityTags.push("female");
  else if (student.Gender === "Male") eligibilityTags.push("male");

  // Normalize student status
  if (student.Student_Status === "Yes") eligibilityTags.push("students");

  // Normalize category
  if (student.Category) eligibilityTags.push(student.Category.toLowerCase());

  // Normalize income
  const incomeValue = student.Household_Income?.replace(/[^\d-]/g, '') || "0";
  const numericIncome = incomeValue.includes('-')
    ? parseInt(incomeValue.split('-')[1])
    : parseInt(incomeValue);

  //if (numericIncome <= 50000) eligibilityTags.push("low-income people");

  return {
    eligibilityTags,
    income: numericIncome,
    age: student.Age_Group === "Below 18" ? 17 : 25, // Approximate
    category: student.Category?.toLowerCase() || "",
  };
}

// ✅ Main function to check eligibility
function isStudentEligible(student, scheme) {
  const {
    eligibilityTags,
    income,
    age,
    category,
  } = normalizeStudentResponse(student);

  const schemeEligibility = Array.isArray(scheme.eligibility) ? scheme.eligibility : [];
  const schemeCategory = scheme.category?.toLowerCase();
  const schemeIncomeRequired = scheme.incomeRequired || 1000000;
  const schemeAgeRange = scheme.ageGroup?.split('-').map(Number) || [0, 100];

  const ageMatch = age >= schemeAgeRange[0] && age <= schemeAgeRange[1];
  const incomeMatch = income <= schemeIncomeRequired;
  const categoryMatch = schemeCategory === category || schemeCategory === "students" || schemeCategory === "all" || schemeCategory === "student";
  const eligibilityMatch = schemeEligibility.some(tag => eligibilityTags.includes(tag.toLowerCase()));

  return eligibilityMatch && categoryMatch;
}


const SchemeRecommendations = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fraudModalVisible, setFraudModalVisible] = useState(false);
  const [fraudReasons, setFraudReasons] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        console.error("User not found!");
        setLoading(false);
        return;
      }

      // Fetch student details
      const { data: userData, error: userError } = await supabase
        .from("student_data")
        .select("*")
        .eq("student_id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user data:", userError);
        setLoading(false);
        return;
      }

      // Fetch all schemes
      const { data: allSchemes, error: schemeError } = await supabase
        .from("schemes")
        .select("*");

      if (schemeError) {
        console.error("Error fetching schemes:", schemeError);
        setLoading(false);
        return;
      }

      // Clean and normalize schemes
      const cleanedSchemes = allSchemes.map((scheme) => {
        let eligibilityArray = [];
        try {
          eligibilityArray = JSON.parse(scheme.eligibility.replace(/\\/g, ""));
        } catch (error) {
          console.error("Error parsing eligibility:", scheme.eligibility, error);
        }

        return {
          ...scheme,
          eligibility: eligibilityArray.map((e) => e.toLowerCase()),
          category: scheme.category?.toLowerCase(),
        };
      });

      const eligibleSchemes = cleanedSchemes.filter((scheme) =>
        isStudentEligible(userData, scheme)
      );

      setSchemes(eligibleSchemes);
      setLoading(false);
    };

    fetchSchemes();
  }, []);
  
  // Function to check fraud status and handle applying for scheme
  const handleApplyClick = async (schemeUrl) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      console.error("User not found!");
      return;
    }

    // Fetch fraud status and reasons from the user_documents_map table
    const { data: fraudData, error: fraudError } = await supabase
      .from("user_documents_map")
      .select("isFraudulent, aadhaar_fraud_reason, ration_fraud_reason, income_fraud_reason, caste_fraud_reason")
      .eq("user_id", user.id)
      .single();

    if (fraudError || !fraudData) {
      console.error("Error fetching fraud data:", fraudError);
      return;
    }

    const { isFraudulent, aadhaar_fraud_reason, ration_fraud_reason, income_fraud_reason, caste_fraud_reason } = fraudData;

    if (isFraudulent) {
      // If fraudulent, show the fraud modal with reasons
      setFraudReasons([
        aadhaar_fraud_reason,
        ration_fraud_reason,
        income_fraud_reason,
        caste_fraud_reason,
      ]);
      setFraudModalVisible(true);
    } else {
      // Redirect to the scheme if not fraudulent
      window.open(schemeUrl, "_blank");
    }
  };

  // Close fraud modal
  const closeFraudModal = () => {
    setFraudModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF", fontSize: "28px", fontWeight: "600", marginBottom: "30px" }}>
        Recommended Schemes for You
      </h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#777", fontSize: "16px" }}>Loading schemes...</p>
      ) : schemes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", fontSize: "16px" }}>No schemes available for your criteria.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateRows: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {schemes.map((scheme) => (
            <div key={scheme.id} style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              fontFamily: "'Segoe UI', sans-serif",
            }}>
              <h3 style={{
                color: "#333",
                marginBottom: "15px",
                fontSize: "20px",
                fontWeight: "500",
                letterSpacing: "1px",
                lineHeight: "1.3",
              }}>
                {scheme.schemeName}
              </h3>
              <p style={{
                fontSize: "14px",
                color: "#555",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}>
                {scheme.description}
              </p>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "18px",
              }}>
                <div>
                  <strong style={{ color: "#1F2937", fontSize: "14px" }}>Category:</strong>
                  <span style={{
                    display: "inline-block",
                    marginTop: "6px",
                    backgroundColor: "#F3F4F6",
                    color: "#1E40AF",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    textTransform: "capitalize",
                    letterSpacing: "0.5px"
                  }}>
                    {scheme.category}
                  </span>
                </div>

                {scheme.eligibility?.length > 0 && (
                  <div>
                    <strong style={{ color: "#1F2937", fontSize: "14px" }}>Eligibility:</strong>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "6px",
                    }}>
                      {scheme.eligibility.map((item, index) => (
                        <span key={index} style={{
                          backgroundColor: "#E0F7FA",
                          color: "#00897B",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          textTransform: "capitalize",
                          letterSpacing: "0.5px"
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => handleApplyClick(scheme.schemeUrl)}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#4CAF50",
                    color: "#ffffff",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "inline-block",
                    transition: "background-color 0.3s ease",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    cursor: "pointer"
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {fraudModalVisible && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "999",
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "8px",
            width: "400px",
            textAlign: "center",
          }}>
            <h3 style={{ color: "#D32F2F", marginBottom: "15px" }}>Fraudulent Documents Detected!</h3>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "#555", fontSize: "14px" }}>
                You cannot apply for any scheme due to the issues with the following documents:
              </p>
              <ul style={{ listStyleType: "disc", marginLeft: "20px", textAlign: "left" }}>
                {fraudReasons.map((reason, idx) => (
                  <li key={idx} style={{ color: "#D32F2F", fontSize: "14px" }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={closeFraudModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#F44336",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeRecommendations;
