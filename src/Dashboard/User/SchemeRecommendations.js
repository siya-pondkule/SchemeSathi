import React, { useEffect, useState } from "react";
import supabase from "../../Supabase/supabase";

const SchemeRecommendations = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility: checks if user's age falls in scheme's age group like "18-30"
  const isAgeEligible = (userAge, ageGroupStr) => {
    if (!userAge || !ageGroupStr) return true;
    const match = ageGroupStr.match(/(\d+)-(\d+)/);
    if (!match) return true;
    const minAge = parseInt(match[1]);
    const maxAge = parseInt(match[2]);
    return userAge >= minAge && userAge <= maxAge;
  };

  // Utility: parses and checks eligibility fields like Student, Disabled etc.
  const checkEligibility = (eligibility, user) => {
    const checks = [
      user.StudentStatus === "Yes" ? eligibility.includes("Students") || eligibility.includes("student") : false,
      user.Employment === "Yes" ? eligibility.includes("employed") : eligibility.includes("unemployed"),
      user.Disability === "Yes" ? eligibility.includes("disabled") : true,
      user.Farmer === "Yes" ? eligibility.includes("farmer") : true,
      user.Business === "Yes" ? eligibility.includes("business") : true,
      user.GovtScheme === "Yes" ? eligibility.includes("govtscheme") : true,
      user.SeniorCitizen === "Yes" ? eligibility.includes("seniorcitizen") : true,
    ];
    return checks.every(Boolean);
  };

  // Utility: matches caste/category
  const categoryMatch = (schemeCategory, userCategory) => {
    if (!schemeCategory) return true;
    const category = schemeCategory.toLowerCase();
    const userCat = userCategory?.toLowerCase();
    return (
      category === "all" ||
      category === userCat 
      
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
  
      // 1. Fetch gender from users table
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
  
      // 2. Fetch user_data
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
  
      // Append gender to userData
      userData.gender = userGender;
  
      const {
        Age,
        Income,
        Employment,
        StudentStatus,
        Category,
        Disability,
        Farmer,
        Business,
        GovtScheme,
        SeniorCitizen,
        gender,
      } = userData;
  
      const userAge = parseInt(Age);
      const userIncome = parseFloat(Income);
  
      // 3. Fetch schemes
      const { data: allSchemes, error: schemeError } = await supabase
        .from("schemes")
        .select("*");
  
      if (schemeError) {
        console.error("Error fetching schemes:", schemeError);
        setLoading(false);
        return;
      }
  
      // 4. Clean & filter schemes
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
          gender: scheme.gender?.toLowerCase(), // assuming scheme has a gender field
        };
      });
  
      const filteredSchemes = cleanedSchemes.filter((scheme) => {
        const eligibility = scheme.eligibility || [];
  
        const matchesCategory = categoryMatch(scheme.category, Category);
        const matchesEligibility = checkEligibility(eligibility, {
          StudentStatus,
          Employment,
          Disability,
          Farmer,
          Business,
          GovtScheme,
          SeniorCitizen,
          Category,
        });
  
        const incomeOk = !scheme.incomeRequired || userIncome <= scheme.incomeRequired;
        const ageOk = isAgeEligible(userAge, scheme.ageGroup);
  
        const genderOk =
          !scheme.gender || scheme.gender === gender;
  
        return (matchesCategory || matchesEligibility || incomeOk || ageOk) && genderOk;
      });
  
      setSchemes(filteredSchemes);
      setLoading(false);
    };
  
    fetchSchemes();
  }, []);
  

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>
        Recommended Schemes for You
      </h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>Loading schemes...</p>
      ) : schemes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>No schemes available for your criteria.</p>
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
  <div
    key={scheme.id}
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "'Segoe UI', sans-serif",
    }}
  >
    <h2 style={{ fontSize: "20px", color: "#1E3A8A", fontWeight: "700", margin: 0 }}>
      {scheme.schemeName}
    </h2>

    <p style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6", margin: 0 }}>
      {scheme.description}
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
      <div>
        <strong style={{ fontSize: "14px", color: "#1F2937" }}>Category:</strong>{" "}
        <span
          style={{
            backgroundColor: "#E0E7FF",
            color: "#1E40AF",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "13px",
            marginLeft: "8px",
          }}
        >
          {scheme.category}
        </span>
      </div>

      {scheme.eligibility?.length > 0 && (
        <div>
          <strong style={{ fontSize: "14px", color: "#1F2937" }}>Eligibility:</strong>
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

    <div style={{ marginTop: "16px" }}>
      <a
        href={scheme.schemeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#2563EB",
          color: "#ffffff",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "8px",
          textDecoration: "none",
          display: "inline-block",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
      >
        Apply Now
      </a>
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default SchemeRecommendations;