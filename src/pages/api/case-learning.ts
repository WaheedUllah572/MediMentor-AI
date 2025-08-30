import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Debugging environment
  console.log("🔑 API KEY exists:", !!process.env.OPENAI_API_KEY);
  console.log("🏢 ORG ID:", process.env.OPENAI_ORG_ID);
  console.log("📂 PROJECT ID:", process.env.OPENAI_PROJECT_ID);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { caseText } = req.body;

  if (!caseText || caseText.trim().length === 0) {
    return res.status(400).json({ error: "No case provided." });
  }

  try {
    const prompt = `
You are MediMentor AI, a clinical reasoning assistant.
Analyze the following medical case:

${caseText}

Provide a structured analysis in this exact format:
- Most Likely Diagnosis
- Possible Differential Diagnoses
- Key Investigations
- Evidence-Based Management (Pharmacological + Lifestyle)
- Prognosis
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      analysis: response.choices[0]?.message?.content || "⚠️ No response.",
    });
  } catch (error: any) {
    console.error("❌ Case Learning error:", error.response?.data || error.message || error);

    return res.status(500).json({
      error: error.message || "Server error",
      details: error.response?.data || null,
    });
  }
}
