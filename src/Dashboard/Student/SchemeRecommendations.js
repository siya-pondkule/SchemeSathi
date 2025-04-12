import React, { useEffect, useState } from "react";
import supabase from "../../Supabase/supabase";

const SchemeRecommendations = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        console.error("User not found!");
        setLoading(false);
        return;
      }

      // Fetch student details (including Gender)
      const { data: userData, error: userError } = await supabase
        .from("student_data")
        .select("Category, Household_Income, Student_Status, Gender")
        .eq("student_id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user data:", userError);
        setLoading(false);
        return;
      }

      const { Category, Household_Income, Student_Status, Gender } = userData;

      // Fetch all schemes (initial filter using category)
      const { data: allSchemes, error: schemeError } = await supabase
        .from("schemes")
        .select("*")
        .or(`category.eq.${Category},category.eq.all,category.eq.students,category.eq.student`);

      if (schemeError) {
        console.error("Error fetching schemes:", schemeError);
        setLoading(false);
        return;
      }

      // Clean and parse eligibility
      const cleanedSchemes = allSchemes.map((scheme) => {
        let eligibilityArray = [];
        try {
          eligibilityArray = JSON.parse(scheme.eligibility.replace(/\\/g, ""));
          eligibilityArray = eligibilityArray.map((e) => e.toLowerCase());
        } catch (error) {
          console.error("Error parsing eligibility:", scheme.eligibility, error);
        }

        return { ...scheme, eligibility: eligibilityArray, category: scheme.category?.toLowerCase() };
      });

      // Final filter: based on student status and gender
      const filteredSchemes = cleanedSchemes.filter((scheme) => {
        const eligibility = scheme.eligibility.map((e) => e.toLowerCase());

        const matchesStudent = Student_Status?.toLowerCase() === "yes"
          ? eligibility.includes("students") || eligibility.includes("student")
          : true;

        const matchesGender = eligibility.includes("all") || eligibility.includes(Gender?.toLowerCase());

        // Normalize category
        const studentCategory = Category?.toLowerCase();
        const schemeCategories = Array.isArray(scheme.category)
          ? scheme.category.map((c) => c.toLowerCase())
          : [scheme.category?.toLowerCase()];

        const matchesCategory = schemeCategories.includes(studentCategory) ||
          schemeCategories.includes("students") ||
          schemeCategories.includes("all");

        return matchesStudent || matchesGender || matchesCategory;
      });

      setSchemes(filteredSchemes);
      setLoading(false);
    };

    fetchSchemes();
  }, []);

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
                <a href={scheme.schemeUrl} target="_blank" rel="noopener noreferrer" style={{
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
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#388E3C")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
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