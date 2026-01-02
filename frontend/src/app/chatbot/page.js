"use client";

import ChatBot from "@/components/ChatBot";

export default function ChatBotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <span className="text-3xl">🏥</span>
            <div>
              <h1 className="text-xl font-bold">Smart Disease Prediction</h1>
              <p className="text-xs text-green-100">Prevention System</p>
            </div>
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-xl py-8">
        <div className="max-w-6xl mx-auto px-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium mb-4 w-fit"
          >
            ← Back to Home
          </a>
          <h1 className="text-4xl font-bold mb-2">💬 Mental Health Support Chat</h1>
          <p className="text-green-100 text-lg">
            Chat with our AI for mental health support and guidance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">💡 About This Chat</h3>
            <p className="text-green-800 text-sm">
              This AI chatbot is designed to provide compassionate mental health support and guidance. 
              It uses advanced language models to understand your concerns and offer helpful responses. 
              However, it is not a substitute for professional mental health care. If you're experiencing 
              a mental health crisis, please reach out to a qualified mental health professional or 
              contact a crisis helpline immediately.
            </p>
          </div>

          <ChatBot />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-semibold mb-2">Smart Disease Prediction and Prevention System</p>
          <p className="text-sm text-slate-500">
            © 2025 | Advanced Health Risk Assessment with Explainable AI (SHAP)
          </p>
          <p className="text-xs text-slate-600 mt-2">
            🚨 Crisis Support: If you're in crisis, please contact emergency services or a crisis helpline.
          </p>
        </div>
      </footer>
    </div>
  );
}
