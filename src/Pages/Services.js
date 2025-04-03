import React from "react";
import { FaMoneyBillWave, FaBriefcase, FaGraduationCap, FaRegHospital, FaHandHoldingHeart, FaChartLine } from "react-icons/fa";

const servicesData = [
  {
    id: 1,
    icon: <FaMoneyBillWave size={40} color="#1e40af" />,
    title: "User Authentication & Management Service",
    description: "Access government grants, subsidies, and financial aid to support your livelihood.",
  },
  {
    id: 2,
    icon: <FaBriefcase size={40} color="#4caf50" />,
    title: "Employment Opportunities",
    description: "Manage user sign-ups, logins, roles, and permissions.",
  },
  {
    id: 3,
    icon: <FaGraduationCap size={40} color="#f97316" />,
    title: "Educational Support",
    description: "Scholarships and financial aid for students to ensure access to quality education.",
  },
  {
    id: 4,
    icon: <FaRegHospital size={40} color="#e11d48" />,
    title: "Healthcare Benefits",
    description: "Affordable healthcare schemes and insurance coverage for citizens in need.",
  },
  {
    id: 5,
    icon: <FaHandHoldingHeart size={40} color="#9333ea" />,
    title: "Schemes for all Users",
    description: "For students and users there will be personalized scheme access.",
  },
  {
    id: 6,
    icon: <FaChartLine size={40} color="#f59e0b" />,
    title: "Alert & Notification Service",
    description: "Sends alerts for flagged fraudulent transactions.",
  },
];

const Services = () => {
  const sectionStyle = {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f0f4f8",
    marginTop: "-20px"
  };

  const headingStyle = {
    marginTop: '-35px',
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: "10px",

  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "auto",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    textAlign: "center",
    cursor: "pointer",
  };

  const cardHoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  };

  return (
    <div id="services" style={sectionStyle}>
      <h2 style={headingStyle}>Our Services</h2>
      <div style={gridStyle}>
        {servicesData.map((service) => (
          <div key={service.id} style={cardStyle} className="service-card">
            <div style={{ marginBottom: "10px" }}>{service.icon}</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>
              {service.title}
            </h3>
            <p style={{ color: "#6b7280" }}>{service.description}</p>
          </div>
        ))}
      </div>

      {/* Add Hover Effect */}
      <style>
        {`
          .service-card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </div>
  );
};

export default Services;
