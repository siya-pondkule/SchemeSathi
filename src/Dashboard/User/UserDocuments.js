import React, { useState } from "react";
import supabase from '../../Supabase/supabase';

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
        setStatus("Please upload all required documents.");
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
      background: "#ffffff",
      padding: "30px",
      maxWidth: "600px",
      margin: "40px auto",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ color: "#1E3A8A", marginBottom: "20px", textAlign: "center" }}>
        📄 Upload Your Documents
      </h2>

      {["aadhaar", "ration", "income", "caste"].map((type, index) => (
        <div key={type} style={{ marginBottom: "18px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
            color: "#1E293B"
          }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Certificate {type === "caste" ? "(If applicable)" : ""}:
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, type)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              background: "#F8FAFC",
              cursor: "pointer"
            }}
          />
        </div>
      ))}

      <button onClick={handleSubmit} style={{
        marginTop: "10px",
        padding: "12px 24px",
        width: "100%",
        backgroundColor: "#2563EB",
        color: "#ffffff",
        border: "none",
        fontWeight: "600",
        borderRadius: "10px",
        fontSize: "16px",
        transition: "background-color 0.3s ease",
        cursor: "pointer"
      }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#1E40AF"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#2563EB"}
      >
        📤 Upload Documents
      </button>

      <p style={{
        marginTop: "18px",
        color: status.includes("❌") ? "#DC2626" : "#059669",
        textAlign: "center",
        fontWeight: "500"
      }}>
        {status}
      </p>
    </div>
  );
};

export default UserDocuments;
