import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ error: "No question provided." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a medical MCQ tutor. Explain correct and incorrect options." },
        { role: "user", content: question },
      ],
    });

    res.status(200).json({ result: response.choices[0].message.content });
  } catch (error: any) {
    console.error("❌ MCQ Tutor error:", error);
    res.status(500).json({ error: error.message });
  }
}
