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
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>Recommended Schemes for You</h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>Loading schemes...</p>
      ) : schemes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>No schemes available for your criteria.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateRows: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}>
          {schemes.map((scheme) => (
            <div key={scheme.id} style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "0.3s",
              cursor: "pointer"
            }}>
              <h3 style={{ color: "#333", marginBottom: "10px" }}>{scheme.schemeName}</h3>
              <p style={{ fontSize: "14px", color: "#555" }}>{scheme.description}</p>
              <p><strong>Category:</strong> {scheme.category}</p>
              <p><strong>Eligibility:</strong> {JSON.stringify(scheme.eligibility)}</p>
              <a href={scheme.schemeUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "8px",
                background: "#007bff",
                color: "white",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: "5px"
              }}>
                Apply Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemeRecommendations;
