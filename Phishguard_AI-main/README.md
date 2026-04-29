# 🛡️ PhishGuard AI

> ⚠️ **PROTOTYPE VERSION** — This project is currently a working prototype and is under active development. Features, APIs, and UI may change significantly in future updates.

**Real-Time Email Phishing Detection System powered by AI**

## 🌐 Live Demo

**Try it now:** [click here for live web app](https://phishguard-black.vercel.app/)


PhishGuard AI is a web application that analyzes emails in real-time to detect phishing attempts. It uses advanced AI (Groq's LLaMA 3.1) to identify suspicious patterns, fake domains, and social engineering tactics, providing users with instant threat assessments and actionable recommendations.


## ✨ Features

- **Real-time Detection** — Analyzes emails instantly with AI-powered classification
- **Threat Classification** — Categorizes emails as Safe, Suspicious, or Phishing
- **Confidence Scoring** — Provides percentage-based confidence levels
- **Threat Identification** — Lists specific threats found (fake domains, urgency tactics, suspicious URLs)
- **Actionable Recommendations** — Tells users exactly what to do
- **Sample Emails** — Pre-loaded phishing and safe email examples for testing

---

## 🏗️ Project Structure

```
phishguard-ai/
├── src/                      # Frontend (React)
│   ├── App.js               # Main app component
│   ├── App.css              # App styles
│   ├── PhishGuardAI.jsx     # Main phishing detection UI
│   ├── index.js             # React entry point
│   └── index.css            # Tailwind CSS imports
│
├── backend/                  # Backend (Node.js/Express)
│   ├── server.js            # Express server with Groq API integration
│   ├── package.json         # Backend dependencies
│   └── package-lock.json    # Dependency lock file
│
├── .env                      # Environment variables (create this)
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone [https://github.com/Yaswanthkumarreddyundela/phishguard.git](https://github.com/Yaswanthkumarreddyundela/Phishguard_AI)
cd Phishguard_AI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env
```

Add your Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to project root (if not already there)
cd Phishguard_AI

# Install frontend dependencies
npm install

# Create frontend environment file
touch .env
```

Add backend URL to `.env` in the project root:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | ✅ Yes |
| `PORT` | Server port (default: 5000) | ❌ No |

#### Frontend (`.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_BACKEND_URL` | Backend API URL | ✅ Yes |

---

## 📖 Usage

1. **Enter Email Details**
   - Paste the sender's email address
   - Add the subject line (optional)
   - Paste the full email body content

2. **Analyze**
   - Click "Analyze for Phishing" button
   - Wait for AI analysis (typically 1-3 seconds)

3. **Review Results**
   - **Classification**: Safe / Suspicious / Phishing
   - **Confidence**: 0-100% certainty level
   - **Threats**: List of detected red flags
   - **Recommendation**: What action to take

### Testing with Samples

Use the built-in sample buttons:
- **Load Phishing Sample** — Fake PayPal email with suspicious domain
- **Load Safe Sample** — Legitimate GitHub notification

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI framework
- **Tailwind CSS** — Styling
- **Lucide React** — Icons

### Backend
- **Node.js** — Runtime
- **Express 5** — Web framework
- **Groq API** — AI inference (LLaMA 3.1 8B)
- **node-fetch** — HTTP client
- **dotenv** — Environment management
- **cors** — Cross-origin requests

---

## 🔌 API Reference

### POST `/analyze`

Analyzes an email for phishing threats.

**Request Body:**

```json
{
  "senderEmail": "security@paypa1-secure.com",
  "subject": "URGENT: Verify Your Account",
  "emailContent": "Your account has been suspended..."
}
```

**Response:**

```json
{
  "classification": "Phishing",
  "confidence": 95,
  "explanation": "The sender domain 'paypa1-secure.com' mimics PayPal with a typo and uses urgency tactics.",
  "threats": [
    "Typosquatting domain (paypa1 vs paypal)",
    "Urgency/fear tactics",
    "Suspicious verification link"
  ],
  "recommendation": "Do not click any links. Delete this email and report it as phishing."
}
```

---

## 🚢 Deployment

### Backend (Render/Railway)

1. Push backend code to GitHub
2. Connect to Render or Railway
3. Set environment variables:
   - `GROQ_API_KEY`
   - `PORT` (usually auto-assigned)
4. Deploy

### Frontend (Vercel/Netlify)

1. Push frontend code to GitHub
2. Connect to Vercel or Netlify
3. Set environment variable:
   - `REACT_APP_BACKEND_URL=https://your-backend-url.com`
4. Deploy

---

## 🔒 Security Notes

- API keys are stored server-side only (never exposed to frontend)
- No email content is stored or logged permanently
- All API communication should use HTTPS in production
- Rate limiting recommended for production deployment

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) — Ultra-fast AI inference
- [Meta LLaMA](https://llama.meta.com) — Open-source LLM
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [Lucide](https://lucide.dev) — Beautiful icons

---

## 📬 Contact

For questions or support, open an issue on GitHub.

---

---

## 🚧 Roadmap (Upcoming Features)

This is a prototype. Here's what's planned for future releases:

- [ ] **Gmail/IMAP Integration** — Auto-fetch emails directly from inbox
- [ ] **Desktop Application** — Standalone app using Electron or PyInstaller
- [ ] **Background Monitoring** — Real-time scanning without manual input
- [ ] **Email Tagging** — Auto-label phishing emails in Gmail
- [ ] **Desktop Notifications** — Instant alerts on threat detection
- [ ] **Local ML Model** — Offline classification with LightGBM/Scikit-learn
- [ ] **Database Logging** — SQLite/MongoDB storage for analysis history
- [ ] **User Feedback Loop** — Mark false positives to improve accuracy
- [ ] **Browser Extension** — Scan emails directly in webmail interfaces
- [ ] **Multi-language Support** — Detect phishing in multiple languages

**Want to contribute?** Check the [Contributing](#-contributing) section!

---

**Built with ❤️ to make the internet safer**

---

## 📌 Disclaimer

This is a **prototype for educational and demonstration purposes**. While it provides AI-powered phishing detection, it should not be used as your sole security measure. Always exercise caution with suspicious emails and use established security tools alongside this application.
