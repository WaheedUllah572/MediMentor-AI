import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  sender: "user" | "ai";
  text: string;
};

const sectionIcons: Record<string, string> = {
  diagnosis: "🩺",
  investigations: "🔬",
  management: "💊",
  lifestyle: "🧘",
  prognosis: "📊",
};

export default function AgentMode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiBase, setApiBase] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Correct API base setup (env var for prod, localhost fallback for dev)
  useEffect(() => {
    setApiBase(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      console.log("📡 Sending request to:", `${apiBase}/api/agent-mode`);

      const res = await fetch(`${apiBase}/api/agent-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      const aiMsg: Message = {
        sender: "ai",
        text: data.reply || "No response from AI",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("❌ Fetch error:", err);

      const errorMsg: Message = {
        sender: "ai",
        text: "⚠️ Error connecting to AI service.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // 🩺 Helper: Add icons for section headings
  const addSectionIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("diagnosis")) return `${sectionIcons.diagnosis} ${text}`;
    if (lower.includes("investigation"))
      return `${sectionIcons.investigations} ${text}`;
    if (lower.includes("management"))
      return `${sectionIcons.management} ${text}`;
    if (lower.includes("lifestyle"))
      return `${sectionIcons.lifestyle} ${text}`;
    if (lower.includes("prognosis")) return `${sectionIcons.prognosis} ${text}`;
    return text;
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          backgroundColor: "#f3f4f6",
          height: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: "1.7rem",
            fontWeight: 700,
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#1e3a8a",
            fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
          }}
        >
          🤖 Agent Mode
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  maxWidth: msg.sender === "user" ? "60%" : "95%",
                  padding: msg.sender === "user" ? "12px 16px" : "20px",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  color: msg.sender === "user" ? "white" : "#1f2937",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(90deg, #2563eb, #1e40af)"
                      : "#f9fafb",
                  boxShadow:
                    msg.sender === "ai"
                      ? "0 3px 10px rgba(0,0,0,0.1)"
                      : "0 2px 6px rgba(0,0,0,0.2)",
                  textAlign: "left",
                  fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                  overflowWrap: "break-word",
                  borderLeft:
                    msg.sender === "ai" ? "5px solid #2563eb" : "none",
                  transition: "transform 0.2s ease",
                }}
              >
                {msg.sender === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => (
                        <h1
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: "700",
                            margin: "14px 0",
                            color: "#1e40af",
                          }}
                          {...props}
                        >
                          {addSectionIcon(String(props.children))}
                        </h1>
                      ),
                      h2: (props) => (
                        <h2
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            margin: "10px 0",
                            color: "#2563eb",
                          }}
                          {...props}
                        >
                          {addSectionIcon(String(props.children))}
                        </h2>
                      ),
                      h3: (props) => (
                        <h3
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            margin: "8px 0",
                            color: "#374151",
                          }}
                          {...props}
                        >
                          {addSectionIcon(String(props.children))}
                        </h3>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.95rem",
                margin: "10px 0",
              }}
            >
              MediMentor AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: "12px",
            background: "white",
            borderRadius: "50px",
            marginTop: "18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <FaSmile
            size={22}
            style={{ marginRight: "12px", color: "#6b7280", cursor: "pointer" }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          {showEmojiPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "60px",
                left: "10px",
                zIndex: 1000,
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Enter a medical case scenario..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              padding: "10px",
              fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
            }}
          />
          <FaPaperPlane
            size={22}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              marginLeft: "12px",
            }}
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
