// src/pages/index.tsx
import React from "react";
import Sidebar from "../components/Sidebar";
import {
  FaRobot,
  FaBookMedical,
  FaImage,
  FaQuestionCircle,
  FaComments,
} from "react-icons/fa";

export default function Home() {
  const modules = [
    {
      title: "Agent Mode",
      description: "Chat with MediMentor AI for instant medical insights.",
      icon: <FaRobot size={32} color="#2563eb" />,
      link: "/agent-mode",
    },
    {
      title: "Case-Based Learning",
      description: "Enter a case scenario and get AI-powered learning points.",
      icon: <FaBookMedical size={32} color="#16a34a" />,
      link: "/case-based-learning",
    },
    {
      title: "Image Analysis",
      description: "Upload medical images for AI-powered diagnostic support.",
      icon: <FaImage size={32} color="#dc2626" />,
      link: "/image-analysis",
    },
    {
      title: "MCQ Tutor",
      description: "Test your knowledge with AI-generated medical MCQs.",
      icon: <FaQuestionCircle size={32} color="#9333ea" />,
      link: "/mcq-tutor",
    },
    {
      title: "Case Discussion",
      description: "Engage in interactive AI-powered viva-style case discussions.",
      icon: <FaComments size={32} color="#f59e0b" />,
      link: "/case-discussion",
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", background: "#f8fafc" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/")} // Clicking header brings back to home
        >
          {/* Doctor Avatar Logo */}
          <img
            src="/doctor-avatar.png" // <-- Place cropped avatar in /public folder
            alt="Doctor Avatar"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />

          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e3a8a" }}>
              MediMentor AI
            </h1>
            <p style={{ color: "#475569", fontSize: "18px", marginTop: "4px" }}>
              Your AI-powered medical learning and diagnostic assistant.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {modules.map((mod, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onClick={() => (window.location.href = mod.link)}
            >
              {/* Icon */}
              <div style={{ marginBottom: "16px" }}>{mod.icon}</div>

              {/* Title */}
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>
                {mod.title}
              </h3>

              {/* Description */}
              <p style={{ color: "#6b7280", fontSize: "15px", margin: "10px 0 20px" }}>
                {mod.description}
              </p>

              {/* Button */}
              <button
                style={{
                  background: "linear-gradient(90deg,#2563eb,#1e40af)",
                  color: "#fff",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Open →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
