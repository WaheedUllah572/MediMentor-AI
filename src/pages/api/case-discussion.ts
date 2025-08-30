import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { caseText, userAnswer } = req.body;
  if (!caseText || caseText.trim().length === 0) {
    return res.status(400).json({ error: "No case provided." });
  }

  try {
    const messages: any[] = [
      { role: "system", content: "You are a senior medical consultant. Ask probing questions, give feedback, and summarize learning points." },
      { role: "user", content: `Case: ${caseText}` },
    ];

    if (userAnswer) {
      messages.push({ role: "user", content: `Student's answer: ${userAnswer}` });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    console.error("❌ Case Discussion error:", error);
    res.status(500).json({ error: error.message });
  }
}
