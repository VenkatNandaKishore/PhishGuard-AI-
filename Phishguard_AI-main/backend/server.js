import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import 'dotenv/config';

// Validate required environment variables on startup
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY is not set in environment variables");
  console.error("Please create a .env file with: GROQ_API_KEY=your_api_key_here");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const app = express();

// Configure CORS for specific origins
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '1mb' }));

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

// Input validation function
function validateInput(senderEmail, subject, emailContent) {
  const errors = [];
  
  if (!senderEmail || typeof senderEmail !== 'string') {
    errors.push('Sender email is required');
  } else if (senderEmail.length > 254) {
    errors.push('Sender email is too long');
  }
  
  if (!emailContent || typeof emailContent !== 'string') {
    errors.push('Email content is required');
  } else if (emailContent.length > 100000) {
    errors.push('Email content exceeds maximum length');
  }
  
  if (subject && subject.length > 500) {
    errors.push('Subject line is too long');
  }
  
  return errors;
}

app.post("/analyze", async (req, res) => {
  const { senderEmail, subject, emailContent } = req.body;

  // Validate input
  const validationErrors = validateInput(senderEmail, subject, emailContent);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      classification: "Error",
      confidence: 0,
      explanation: validationErrors.join('; '),
      threats: [],
      recommendation: "Please provide valid input"
    });
  }

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
      explanation: err.message || "Backend crashed",
      threats: [],
      recommendation: "Try later"
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🔒 API Key configured: ${process.env.GROQ_API_KEY ? 'Yes' : 'No'}`);
});
