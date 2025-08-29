import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaStethoscope } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";

export default function CaseBasedLearning() {
  const [caseText, setCaseText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiBase, setApiBase] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    setApiBase(apiUrl);
  }, []);

  const handleSubmit = async () => {
    if (!caseText.trim()) return alert("⚠️ Please enter a case description.");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch(`${apiBase}/api/case-learning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case: caseText }),
      });

      const data = await res.json();
      setResult(data.analysis || "⚠️ No analysis received from AI.");
    } catch (err) {
      console.error("❌ Error:", err);
      setResult("⚠️ Error connecting to AI service.");
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const pdf = new jsPDF();
    pdf.text("Case-Based Learning Report", 15, 20);
    pdf.text(result, 15, 40);
    pdf.save("case-analysis.pdf");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px",
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "30px",
            width: "100%",
            maxWidth: "750px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <FaStethoscope size={28} color="#2563eb" />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e3a8a" }}>
              Case-Based Learning
            </h2>
          </div>

          <textarea
            value={caseText}
            onChange={(e) => setCaseText(e.target.value)}
            placeholder="Enter a medical case description..."
            rows={6}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              marginBottom: "20px",
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "linear-gradient(90deg, #9ca3af, #6b7280)"
                : "linear-gradient(90deg, #2563eb, #1e40af)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "15px",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Analyzing..." : "Submit"}
          </button>

          {result && (
            <>
              <div
                style={{
                  marginTop: "25px",
                  padding: "22px",
                  background: "#f9fafb",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  color: "#111827",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>

              <button
                onClick={handleDownloadPDF}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  background: "linear-gradient(90deg, #059669, #047857)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                📄 Download as PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
