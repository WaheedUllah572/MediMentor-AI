import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: "No query provided." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful medical AI assistant." },
        { role: "user", content: query },
      ],
    });

    res.status(200).json({
      reply: response.choices[0]?.message?.content || "⚠️ No reply generated.",
    });
  } catch (error: any) {
    console.error("❌ Agent Mode error:", error);

    res.status(500).json({
      error: error.message || "Server error",
      details: error.response?.data || error.stack || null,
      envCheck: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✅ set" : "❌ missing",
        OPENAI_ORG_ID: process.env.OPENAI_ORG_ID ? "✅ set" : "❌ missing",
        OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID ? "✅ set" : "❌ missing",
      },
    });
  }
}
