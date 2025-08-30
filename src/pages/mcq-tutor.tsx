import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaQuestionCircle } from "react-icons/fa";

type Option = {
  label: string;
  value: string;
};

export default function McqTutor() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { label: "A", value: "" },
    { label: "B", value: "" },
    { label: "C", value: "" },
    { label: "D", value: "" },
  ]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResult("");

    const formattedQuestion = `${question}\nOptions:\n${options
      .map((opt) => `${opt.label}. ${opt.value}`)
      .join("\n")}\nUser selected: ${selected || "None"}`;

    try {
      const res = await fetch("/api/mcq-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: formattedQuestion }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResult(data.result || "⚠️ No answer received from AI.");
    } catch (err) {
      console.error("❌ MCQ Tutor error:", err);
      setResult("⚠️ Error connecting to AI service.");
    }
    setLoading(false);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].value = value;
    setOptions(newOptions);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "40px",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            width: "100%",
            maxWidth: "700px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <FaQuestionCircle size={28} color="#2563eb" />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
              MCQ Tutor
            </h2>
          </div>
          <p style={{ color: "#4b5563", marginBottom: "20px" }}>
            Enter a multiple-choice question. MediMentor AI will explain the correct answer and reasoning.
          </p>

          {/* Question Input */}
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your MCQ question here..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "1rem",
              marginBottom: "20px",
            }}
          />

          {/* Options */}
          {options.map((opt, i) => (
            <div
              key={opt.label}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                border:
                  selected === opt.label
                    ? "2px solid #2563eb"
                    : "1px solid #d1d5db",
                backgroundColor: selected === opt.label ? "#eff6ff" : "#f9fafb",
                cursor: "pointer",
              }}
              onClick={() => setSelected(opt.label)}
            >
              <span style={{ fontWeight: 600, marginRight: "10px" }}>
                {opt.label}.
              </span>
              <input
                type="text"
                value={opt.value}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Enter option ${opt.label}`}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1rem",
                }}
              />
            </div>
          ))}

          {/* Submit Button */}
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
              marginTop: "15px",
            }}
          >
            {loading ? "Analyzing..." : "Get AI Answer"}
          </button>

          {/* AI Response */}
          {result && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "#f3f4f6",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                fontSize: "1rem",
                color: "#111827",
              }}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
