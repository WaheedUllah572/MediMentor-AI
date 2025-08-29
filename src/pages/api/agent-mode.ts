import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initialize OpenAI client with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    console.error("❌ Agent Mode error:", error);
    res.status(500).json({ error: error.message });
  }
}
