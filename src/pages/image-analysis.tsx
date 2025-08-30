import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaMicroscope, FaFilePdf } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";

export default function ImageAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
        alert("⚠️ Only JPG, JPEG, PNG allowed.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("⚠️ Please upload an image first.");

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

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
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Medical Image Analysis Report", 15, 20);

    let y = 40;
    const lines = pdf.splitTextToSize(result, 180);
    lines.forEach((line) => {
      pdf.text(line, 15, y);
      y += 8;
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
    });

    pdf.save("image-analysis.pdf");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
        <div style={{ background: "white", borderRadius: "18px", padding: "30px", width: "100%", maxWidth: "750px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <FaMicroscope size={28} color="#2563eb" />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e3a8a" }}>Image Analysis</h2>
          </div>
          <p style={{ color: "#4b5563", marginBottom: "20px" }}>
            Upload a medical image (JPG, JPEG, PNG) and MediMentor AI will generate a structured report.
          </p>

          {/* Upload Section */}
          <div style={{ background: "#f9fafb", border: "2px dashed #2563eb", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              style={{ display: "block", margin: "0 auto" }}
            />
            <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "8px" }}>
              Drag & Drop or Click to Upload
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "linear-gradient(90deg, #9ca3af, #6b7280)" : "linear-gradient(90deg, #2563eb, #1e40af)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "15px",
            }}
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>

          {/* Results */}
          {result && (
            <>
              <div style={{ marginTop: "25px", padding: "22px", background: "#f9fafb", borderRadius: "14px", fontSize: "1rem", color: "#111827", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)" }}>
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
                  cursor: "pointer",
                }}
              >
                <FaFilePdf style={{ marginRight: "8px" }} /> Download as PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
