import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaComments } from "react-icons/fa";

export default function CaseDiscussion() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const body =
        messages.length === 0
          ? { caseText: input }
          : { caseText: messages[0].text, userAnswer: input };

      const res = await fetch("/api/case-discussion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "⚠️ No response." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Error connecting to AI service." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaComments size={28} color="#2563eb" />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e3a8a" }}>Case Discussion</h2>
        </div>
        <p style={{ color: "#4b5563", marginBottom: "20px" }}>
          Engage in AI-powered interactive medical case discussions (viva-style).
        </p>

        <div style={{ flex: 1, background: "white", borderRadius: "12px", padding: "20px", overflowY: "auto", maxHeight: "60vh", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)" }}>
          {messages.length === 0 && (
            <p style={{ color: "#9ca3af", textAlign: "center" }}>
              💬 Start the discussion by typing a case scenario...
            </p>
          )}
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "15px", textAlign: msg.role === "user" ? "right" : "left" }}>
              <div
                style={{
                  display: "inline-block",
                  background: msg.role === "user" ? "#2563eb" : "#e5e7eb",
                  color: msg.role === "user" ? "#fff" : "#111827",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", marginTop: "20px", gap: "10px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your case or answer..."
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "1rem" }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              background: loading ? "linear-gradient(90deg, #9ca3af, #6b7280)" : "linear-gradient(90deg, #2563eb, #1e40af)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
