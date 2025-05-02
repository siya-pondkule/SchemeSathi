import React, { useState } from "react";
import supabase from "../../Supabase/supabase";

const UserDocuments = ({ userId }) => {
  const [files, setFiles] = useState({
    aadhaar: null,
    ration: null,
    income: null,
    caste: null,
  });
  const [status, setStatus] = useState("");

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const uploadFile = async (file, fileName) => {
    if (!file) return null;

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${userId}/${fileName}`, file, {
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from("documents")
      .getPublicUrl(`${userId}/${fileName}`);

    return publicData.publicUrl;
  };

  const handleSubmit = async () => {
    try {
      setStatus("Uploading...");

      const aadhaarUrl = await uploadFile(files.aadhaar, "aadhaar1.pdf");
      const rationUrl = await uploadFile(files.ration, "ration1.pdf");
      const incomeUrl = await uploadFile(files.income, "income1.pdf");

      if (!aadhaarUrl || !rationUrl || !incomeUrl) {
        setStatus("❌ Please upload all required documents.");
        return;
      }

      let casteUrl = null;
      if (files.caste) {
        casteUrl = await uploadFile(files.caste, "caste1.pdf");
      }

      const { error } = await supabase.from("user_documents_map").insert([
        {
          user_id: userId,
          aadhaar_url: aadhaarUrl,
          ration_url: rationUrl,
          income_url: incomeUrl,
          caste_url: casteUrl,
        },
      ]);

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      setStatus("✅ Documents uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("❌ Upload failed. Please try again.");
    }
  };

  return (
    <div style={{
      background: "#fff",
      padding: "24px",
      maxWidth: "500px",
      margin: "30px auto",
      borderRadius: "14px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
      fontFamily: "'Inter', sans-serif"
    }}>
      <h2 style={{
        color: "#1E3A8A",
        fontSize: "20px",
        textAlign: "center",
        marginBottom: "16px",
        fontWeight: "700"
      }}>
        📑 Upload Required Documents
      </h2>

      {["aadhaar", "ration", "income", "caste"].map((type) => (
        <div key={type} style={{ marginBottom: "14px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
            color: "#334155",
            fontSize: "14px"
          }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Certificate {type === "caste" ? "(Optional)" : ""}
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, type)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #E2E8F0",
              backgroundColor: "#F9FAFB",
              transition: "border 0.2s ease-in-out",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.border = "1px solid #60A5FA"}
            onBlur={(e) => e.target.style.border = "1px solid #E2E8F0"}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "8px",
          padding: "10px 20px",
          width: "100%",
          backgroundColor: "#3B82F6",
          color: "#ffffff",
          border: "none",
          fontWeight: "600",
          fontSize: "15px",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#1D4ED8"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "#3B82F6"}
      >
        🚀 Submit Documents
      </button>

      {status && (
        <p style={{
          marginTop: "14px",
          textAlign: "center",
          color: status.includes("❌") ? "#DC2626" : "#10B981",
          fontWeight: "500",
          fontSize: "14px"
        }}>
          {status}
        </p>
      )}
    </div>
  );
};

export default UserDocuments;
