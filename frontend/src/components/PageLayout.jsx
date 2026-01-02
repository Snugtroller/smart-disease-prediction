"use client";

import Link from "next/link";

export default function PageLayout({ title, subtitle, children, showBack = true }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            {showBack && (
              <Link 
                href="/" 
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
              >
                ← Back to Home
              </Link>
            )}
            <div></div>
          </div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-blue-100 text-lg">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="mb-2">Smart Disease Prediction and Prevention System</p>
          <p className="text-sm text-slate-500">
            © 2025 | AI-Powered Health Risk Assessment with Explainable AI (SHAP)
          </p>
        </div>
      </footer>
    </div>
  );
}
