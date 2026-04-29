
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Mail, Loader2, ExternalLink } from 'lucide-react';

export default function PhishGuardAI() {
  const [emailContent, setEmailContent] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeEmail = async () => {
    if (!emailContent.trim() || !senderEmail.trim()) {
      alert('Please enter both sender email and email content');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
    const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/analyze`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderEmail, subject, emailContent })
    }
  );

      const data = await response.json();
      
      
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({
        classification: 'Error',
        confidence: 0,
        explanation: 'Failed to analyze email. Please try again.',
        threats: [],
        recommendation: 'Try again with different content'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (classification) => {
    switch (classification) {
      case 'Safe':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'Suspicious':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Phishing':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSeverityIcon = (classification) => {
    switch (classification) {
      case 'Safe':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'Suspicious':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'Phishing':
        return <Shield className="w-6 h-6 text-red-600" />;
      default:
        return <Mail className="w-6 h-6 text-gray-600" />;
    }
  };

  const loadSamplePhishing = () => {
    setSenderEmail('security@paypa1-secure.com');
    setSubject('URGENT: Verify Your Account Now!');
    setEmailContent(`Dear Valued Customer,

Your PayPal account has been temporarily suspended due to unusual activity. 

To restore access immediately, please verify your identity by clicking the link below:

http://paypa1-secure.com/verify-account?id=8472639

You have 24 hours to complete this verification or your account will be permanently closed.

If you did not request this, please ignore this message.

Best regards,
PayPal Security Team`);
  };

  const loadSampleLegit = () => {
    setSenderEmail('notifications@github.com');
    setSubject('Your pull request was merged');
    setEmailContent(`Hi there,

Your pull request #1234 in repository username/project has been successfully merged into the main branch.

You can view the merge commit here:
https://github.com/username/project/pull/1234

Thanks for your contribution!

Best,
The GitHub Team`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">PhishGuard AI</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Real-Time Email Phishing Detection powered by PhishGaurd AI
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Email to Analyze
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Email Address
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="sender@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Paste the email content here..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadSamplePhishing}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                >
                  Load Phishing Sample
                </button>
                <button
                  onClick={loadSampleLegit}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                >
                  Load Safe Sample
                </button>
              </div>

              <button
                onClick={analyzeEmail}
                disabled={analyzing}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Email...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Analyze for Phishing
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Detection Results
            </h2>

            {!result && !analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Shield className="w-16 h-16 mb-4" />
                <p className="text-center">
                  Enter email details and click "Analyze" to detect phishing attempts
                </p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-600">Analyzing email with AI...</p>
              </div>
            )}

            {result && !analyzing && (
              <div className="space-y-4">
                {/* Classification Badge */}
                <div className={`border-2 rounded-lg p-4 ${getSeverityColor(result.classification)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getSeverityIcon(result.classification)}
                    <div>
                      <h3 className="text-xl font-bold">{result.classification}</h3>
                      <p className="text-sm">Confidence: {result.confidence}%</p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Analysis</h4>
                  <p className="text-gray-700">{result.explanation}</p>
                </div>

                {/* Threats Detected */}
                {result.threats && result.threats.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Threats Detected
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.threats.map((threat, idx) => (
                        <li key={idx} className="text-red-700 text-sm">{threat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Recommendation</h4>
                  <p className="text-blue-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Content Analysis</h4>
                <p className="text-sm text-gray-600">Analyzes sender, subject, and body for suspicious patterns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">AI-Powered Detection</h4>
                <p className="text-sm text-gray-600">Uses PhishGuard AI to identify phishing tactics and threats</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Instant Results</h4>
                <p className="text-sm text-gray-600">Get classification and explanations in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}