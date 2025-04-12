import React from "react";
import {
  FaRegListAlt, // For Government Scheme Information Portal
  FaHandHoldingUsd, // For Personalized Scheme Recommendations
  FaShieldAlt, // For AI/ML-Powered Fraud Detection
  FaClipboardCheck, // For Real-Time Eligibility Evaluation
  FaUsersCog, // For Admin Dashboard for Scheme Management
  FaRegUserCircle, // For User Profile and Scheme Application Management
} from "react-icons/fa";

const servicesData = [
  {
    id: 1,
    icon: <FaRegListAlt size={40} />,
    title: "Government Scheme Information Portal",
    description:
      "A comprehensive listing of all available government schemes, categorized by target user groups such as students, women, and senior citizens. This service ensures that users can easily access and explore various government benefits.",
    color: "#1e40af",
  },
  {
    id: 2,
    icon: <FaHandHoldingUsd size={40} />,
    title: "Personalized Scheme Recommendations",
    description:
      "A dynamic eligibility check system through a quiz-based approach that evaluates users’ responses to provide tailored scheme recommendations based on their profile and needs.",
    color: "#4caf50",
  },
  {
    id: 3,
    icon: <FaShieldAlt size={40} />,
    title: "AI/ML-Powered Fraud Detection",
    description:
      "A fraud detection system that leverages AI and machine learning models to validate user-submitted data, ensuring the authenticity of applicants and preventing fraudulent claims.",
    color: "#f97316",
  },
  {
    id: 4,
    icon: <FaClipboardCheck size={40} />,
    title: "Real-Time Eligibility Evaluation",
    description:
      "The eligibility quiz service evaluates users’ eligibility for specific government schemes in real time, offering instant feedback and displaying relevant schemes based on their responses.",
    color: "#e11d48",
  },
  {
    id: 5,
    icon: <FaUsersCog size={40} />,
    title: "Admin Dashboard for Scheme Management",
    description:
      "An interface for administrators to manage and monitor government schemes, including viewing user data, fraud detection alerts, and detailed statistics on scheme distribution.",
    color: "#9333ea",
  },
  {
    id: 6,
    icon: <FaRegUserCircle size={40} />,
    title: "User Profile and Scheme Application Management",
    description:
      "A secure platform for users to create and manage profiles, apply for schemes, and track the status of their applications, ensuring a smooth experience throughout the process.",
    color: "#f59e0b",
  },
];

const Services = () => {
  const sectionStyle = {
    textAlign: "center",
    padding: "10px 20px",
    background: "linear-gradient(to bottom right, #e0f2fe, #f8fafc)",
  };

  const headingStyle = {
    fontSize: "2.75rem",
    fontWeight: "bold",
    background: "linear-gradient(to right, #1e40af, #9333ea)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    color: "#111827",
    transition: "all 0.3s ease-in-out",
    textAlign: "center",
    cursor: "pointer",
  };

  return (
    <div id="services" style={sectionStyle}>
      <h2 style={headingStyle}>Our Services</h2>
      <div style={gridStyle}>
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="service-card"
            style={{
              ...cardStyle,
              borderTop: `4px solid ${service.color}`,
            }}
          >
            <div
              style={{
                marginBottom: "15px",
                color: service.color,
                transition: "transform 0.3s ease",
              }}
              className="icon-hover"
            >
              {React.cloneElement(service.icon, { color: service.color })}
            </div>
            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {service.title}
            </h3>
            <p style={{ color: "#4b5563" }}>{service.description}</p>
          </div>
        ))}
      </div>

      {/* Hover Effect Styling */}
      <style>
        {`
          .service-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }

          .service-card:hover .icon-hover {
            transform: scale(1.2) rotate(5deg);
          }
        `}
      </style>
    </div>
  );
};

export default Services;
