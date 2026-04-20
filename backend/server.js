import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import 'dotenv/config';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to extract JSON even if the model adds extra text
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

app.post("/analyze", async (req, res) => {
  const { senderEmail, subject, emailContent } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `
STRICT INSTRUCTIONS:
- Reply ONLY with JSON.
- NO markdown.
- NO explanation outside JSON.
- NO backticks.
- Ensure all quotes are escaped.

Analyze this email:

Sender: ${senderEmail}
Subject: ${subject}
Body: ${emailContent}

Return JSON ONLY in this EXACT format:

{
  "classification": "Safe" | "Suspicious" | "Phishing",
  "confidence": 0-100,
  "explanation": "short reason",
  "threats": ["list"],
  "recommendation": "short advice"
}
`
          }
        ],
        max_tokens: 600,
        temperature: 0.2
      })
    });

    const data = await response.json();
    console.log("GROQ RAW RESPONSE:", JSON.stringify(data, null, 2));
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      console.log("Groq error:", data);
      return res.status(500).json({
        classification: "Error",
        confidence: 0,
        explanation: data.error?.message || "No response",
        threats: [],
        recommendation: "Try again"
      });
    }

    const json = extractJSON(text);

    if (!json) {
      console.error("Failed to extract JSON:", text);
      return res.status(500).json({
        classification: "Error",
        confidence: 0,
        explanation: "Invalid JSON returned by model",
        threats: [],
        recommendation: "Try again"
      });
    }

    res.json(json);

  } catch (err) {
    console.error("Backend crash:", err);
    res.status(500).json({
      classification: "Error",
      confidence: 0,
      explanation: "Backend crashed",
      threats: [],
      recommendation: "Try later"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
