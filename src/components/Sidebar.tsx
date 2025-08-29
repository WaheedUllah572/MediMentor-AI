// src/components/Sidebar.tsx
import React, { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBrain,
  FaXRay,
  FaQuestionCircle,
  FaRobot,
  FaBars,
  FaComments,
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: isOpen ? "240px" : "80px",
          transition: "width 0.3s ease",
          background:
            "linear-gradient(180deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          color: "#fff",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hamburger */}
        <div
          style={{
            display: "flex",
            justifyContent: isOpen ? "flex-end" : "center",
            padding: "15px",
          }}
        >
          <FaBars
            size={24}
            style={{ cursor: "pointer", color: "#fff" }}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {/* ✅ Logo clickable */}
        {isOpen && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Link href="/">
              <img
                src="/logo.png"
                alt="MediMentor AI Logo"
                className="sidebar-logo"
              />
            </Link>
          </div>
        )}

        {/* Menu Items */}
        <nav style={{ marginTop: "10px", flex: 1 }}>
          <SidebarItem
            href="/"
            icon={<FaHome size={20} />}
            label="Home"
            isOpen={isOpen}
            active
          />
          <SidebarItem
            href="/case-based-learning"
            icon={<FaBrain size={20} />}
            label="Case Learning"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/image-analysis"
            icon={<FaXRay size={20} />}
            label="Image Analysis"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/mcq-tutor"
            icon={<FaQuestionCircle size={20} />}
            label="MCQ Tutor"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/agent-mode"
            icon={<FaRobot size={20} />}
            label="Agent Mode"
            isOpen={isOpen}
          />
          {/* ✅ New Case Discussion */}
          <SidebarItem
            href="/case-discussion"
            icon={<FaComments size={20} />}
            label="Case Discussion"
            isOpen={isOpen}
          />
        </nav>

        {/* Footer */}
        {isOpen && (
          <div
            style={{
              padding: "15px",
              fontSize: "0.8rem",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            © 2025 MediMentor
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        style={{
          marginLeft: isOpen ? "240px" : "80px",
          transition: "margin-left 0.3s ease",
          padding: "20px",
          width: "100%",
          minHeight: "100vh",
          background: "#f4f6f9",
        }}
      ></div>

      {/* ✅ Styling for logo */}
      <style jsx>{`
        .sidebar-logo {
          width: 140px;
          height: auto;
          margin: 0 auto 10px;
          filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.8));
          transition: transform 0.3s ease, filter 0.3s ease;
          cursor: pointer;
        }

        .sidebar-logo:hover {
          transform: scale(1.08);
          filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.9));
        }
      `}</style>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  isOpen,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "flex-start" : "center",
          padding: "12px 18px",
          cursor: "pointer",
          gap: isOpen ? "15px" : "0px",
          transition: "all 0.3s ease",
          borderRadius: "10px",
          margin: "6px 12px",
          color: "#fff",
          fontWeight: 500,
          background: active ? "rgba(59, 130, 246, 0.2)" : "transparent",
          boxShadow: active ? "0 0 10px rgba(59,130,246,0.6)" : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = active
            ? "rgba(59, 130, 246, 0.2)"
            : "transparent";
        }}
      >
        {icon}
        {isOpen && <span>{label}</span>}
      </div>
    </Link>
  );
}
