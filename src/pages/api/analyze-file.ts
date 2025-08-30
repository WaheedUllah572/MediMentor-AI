import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    try {
      const file: any = files.file;
      const fileType = file.mimetype || "image/png";
      const buffer = fs.readFileSync(file.filepath);
      const imageBase64 = buffer.toString("base64");

      const messages: any = [
        {
          role: "system",
          content:
            "You are a senior radiologist. Provide a detailed structured medical imaging report including: Key Findings, Differential Diagnoses, Clinical Significance, and Recommendations.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze this medical image in detail." },
            { type: "image_url", image_url: { url: `data:${fileType};base64,${imageBase64}` } },
          ],
        },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });

      res.status(200).json({
        analysis: response.choices[0]?.message?.content || "⚠️ No analysis returned",
      });
    } catch (error: any) {
      console.error("❌ Image analysis error:", error);

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
  });
}
