import React, { useEffect, useState } from "react";
import supabase from "../../Supabase/supabase";

const SchemeRecommendations = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fraudReasons, setFraudReasons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Utility: Normalize string income to number
  const incomeMap = {
    "Below ₹10,000": 10000,
    "Below ₹50,000": 50000,
    "Below ₹1,00,000": 100000,
    "Above ₹1,00,000": 100001,
  };

   // Utility: determine eligibility
   const isSchemeEligible = (scheme, user) => {
    const userIncome = incomeMap[user.Income] || parseFloat(user.Income) || 0;
    const schemeIncome = scheme.incomeRequired || Infinity;

    // Age eligibility
    const userAge = parseInt(user.Age);
    let ageEligible = true;
    if (scheme.ageGroup) {
      const match = scheme.ageGroup.match(/(\d+)-(\d+)/);
      if (match) {
        const [minAge, maxAge] = [parseInt(match[1]), parseInt(match[2])];
        ageEligible = userAge >= minAge && userAge <= maxAge;
      }
    }

    // Category match
    const categoryMatch =
      !scheme.category || scheme.category === "all" || scheme.category === user.Category?.toLowerCase();

    // Gender match
    const genderOk = !scheme.gender || scheme.gender === user.gender;

    // Eligibility tag match
    const eligibilityTags = scheme.eligibility || [];
    
  const quizMatch = eligibilityTags.length === 0 || eligibilityTags.some((tag) =>
    Object.values(user)
      .map((val) => (typeof val === "string" ? val.toLowerCase() : val))
      .includes(tag)
  );
    console.log(eligibilityTags);

    // Student restriction
    const studentBlocked = eligibilityTags.includes("students") && user.StudentStatus === "No";
    const farmerRequired = eligibilityTags.includes("farmer");
  const farmerEligible = user.farmer === "Yes";

  // ❌ Exclude if farmer scheme and user is not a farmer
  if (farmerRequired && farmerEligible) {
    return true
  }

  return (
    userIncome <= schemeIncome  &&
    categoryMatch &&
    genderOk &&
    quizMatch &&
    !studentBlocked 
  );
  };


  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("User not found!");
        setLoading(false);
        return;
      }

      // 1. Get gender from users table
      const { data: genderData, error: genderError } = await supabase
        .from("users")
        .select("gender")
        .eq("id", user.id)
        .single();

      if (genderError || !genderData) {
        console.error("Error fetching gender:", genderError);
        setLoading(false);
        return;
      }

      const userGender = genderData.gender?.toLowerCase();

      // 2. Get user_data
      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user data:", userError);
        setLoading(false);
        return;
      }

      userData.gender = userGender;

      // 3. Fetch schemes
      const { data: allSchemes, error: schemeError } = await supabase
        .from("schemes")
        .select("*");

      if (schemeError) {
        console.error("Error fetching schemes:", schemeError);
        setLoading(false);
        return;
      }

      // 4. Normalize and filter schemes
      const cleanedSchemes = allSchemes.map((scheme) => {
        let eligibilityArray = [];
        try {
          if (typeof scheme.eligibility === "string") {
            eligibilityArray = JSON.parse(scheme.eligibility.replace(/\\/g, ""));
          } else if (typeof scheme.eligibility === "object") {
            eligibilityArray = Object.values(scheme.eligibility);
          }
          eligibilityArray = eligibilityArray.map((e) => e.toLowerCase());
        } catch (error) {
          console.error("Error parsing eligibility:", scheme.eligibility, error);
        }

        return {
          ...scheme,
          eligibility: eligibilityArray,
          category: scheme.category?.toLowerCase(),
          gender: scheme.gender?.toLowerCase(),
        };
      });

      const eligibleSchemes = cleanedSchemes.filter((scheme) => isSchemeEligible(scheme, userData));

      setSchemes(eligibleSchemes);
      setLoading(false);
    };

    fetchSchemes();
  }, []);
  
  const handleApplyClick = async (schemeUrl) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("User not logged in.");
      return;
    }

    const { data: documentData, error } = await supabase
      .from("user_documents_map")
      .select("isFraudulent, aadhaar_fraud_reason, ration_fraud_reason, income_fraud_reason, caste_fraud_reason")
      .eq("user_id", user.id)
      .single();

    if (error || documentData === null) {
      alert("Error checking document fraud status. Upload documnets first");
      return;
    }

    const { isFraudulent, aadhaar_fraud_reason, ration_fraud_reason, income_fraud_reason, caste_fraud_reason } = documentData;

    if (isFraudulent) {
      let reasons = [];

      if (aadhaar_fraud_reason) reasons.push(`Aadhar Issue: ${aadhaar_fraud_reason}`);
      if (ration_fraud_reason) reasons.push(`Ration Card Issue: ${ration_fraud_reason}`);
      if (income_fraud_reason) reasons.push(`Income Certificate Issue: ${income_fraud_reason}`);
      if (caste_fraud_reason) reasons.push(`Caste Certificate Issue: ${caste_fraud_reason}`);

      setFraudReasons(reasons);
      setModalVisible(true); // Show modal with fraud reasons
    } else {
      alert("✅ You are eligible to apply. Redirecting to the scheme...");
      window.open(schemeUrl, "_blank");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setFraudReasons([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>
        Recommended Schemes for You
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading schemes...</p>
      ) : schemes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No schemes available for your criteria.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateRows: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h2 style={{ fontSize: "20px", color: "#1E3A8A", fontWeight: "700" }}>
                {scheme.schemeName}
              </h2>
              <p style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
                {scheme.description}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <strong>Category:</strong>{" "}
                  <span style={{ backgroundColor: "#E0E7FF", color: "#1E40AF", padding: "4px 12px", borderRadius: "9999px" }}>
                    {scheme.category}
                  </span>
                </div>

                {scheme.eligibility?.length > 0 && (
                  <div>
                    <strong>Eligibility:</strong>
                    <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {scheme.eligibility.map((item, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#FEF3C7",
                            color: "#92400E",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "13px",
                            textTransform: "capitalize",
                          }}
                        >
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
                    backgroundColor: "#2563EB",
                    color: "#ffffff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fraud Modal */}
      {modalVisible && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 999
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "24px", borderRadius: "12px",
            width: "90%", maxWidth: "500px", boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ color: "#DC2626", marginBottom: "12px" }}>
              ❌ You are not eligible to apply
            </h3>
            <p style={{ fontSize: "15px", marginBottom: "10px" }}>
              Your site iss blocked due to fraudulent documents:
            </p>
            <ul style={{ listStyle: "disc", paddingLeft: "20px", color: "#B91C1C" }}>
              {fraudReasons.map((reason, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>{reason}</li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
                backgroundColor: "#DC2626",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
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
