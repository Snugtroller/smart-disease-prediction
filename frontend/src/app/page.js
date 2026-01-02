"use client";

import Link from "next/link";

export default function Home() {
  const cards = [
    {
      title: "Type 2 Diabetes",
      icon: "🩺",
      description: "Assess your risk for Type 2 Diabetes based on health metrics",
      href: "/diabetes",
      color: "from-blue-500 to-blue-600",
      details: "6 health factors • AI Analysis • Personalized advice",
    },
    {
      title: "Hypertension",
      icon: "❤️",
      description: "Check your blood pressure and cardiovascular health risk",
      href: "/hypertension",
      color: "from-red-500 to-red-600",
      details: "8 cardiac factors • Expert insights • Risk classification",
    },
    {
      title: "Stroke Risk",
      icon: "🧠",
      description: "Evaluate your stroke risk using advanced ML models",
      href: "/stroke",
      color: "from-purple-500 to-purple-600",
      details: "7 risk factors • Instant assessment • Prevention tips",
    },
    {
      title: "Mental Health Chat",
      icon: "💬",
      description: "Chat with AI for mental health support and guidance",
      href: "/chatbot",
      color: "from-green-500 to-green-600",
      details: "24/7 support • Confidential • Compassionate AI",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏥</span>
            <div>
              <h1 className="text-xl font-bold">Smart Disease Prediction</h1>
              <p className="text-xs text-blue-100">Prevention System</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-20 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold mb-4">
              🏥 Smart Disease Prediction
            </h1>
            <h2 className="text-3xl font-light text-blue-100">
              Prevention System
            </h2>
          </div>
          <p className="text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
            Harness the power of artificial intelligence to understand your health risks. 
            Get personalized insights, explainable AI analysis, and actionable recommendations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">
            Choose Your Health Assessment
          </h2>
          <p className="text-slate-600 text-lg text-center max-w-2xl mx-auto">
            Select a condition to assess your risk and receive AI-powered insights with 
            explainable analysis using cutting-edge machine learning models.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {cards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105">
                {/* Top Bar */}
                <div className={`bg-gradient-to-r ${card.color} h-2`}></div>

                {/* Content */}
                <div className="p-8 h-full flex flex-col">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{card.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-base mb-6 flex-grow">
                    {card.description}
                  </p>

                  {/* Details */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
                    <span>{card.details}</span>
                  </div>

                  {/* Button */}
                  <button
                    className={`w-full py-3 px-6 bg-gradient-to-r ${card.color} text-white rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <span>Start Assessment</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div id="features" className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Why Choose Our System?
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="font-bold text-slate-900 mb-2">AI-Powered</h4>
              <p className="text-slate-600 text-sm">
                Advanced machine learning models for accurate risk assessment
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="font-bold text-slate-900 mb-2">Explainable</h4>
              <p className="text-slate-600 text-sm">
                SHAP analysis shows exactly which factors influence your risk
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-bold text-slate-900 mb-2">Instant Results</h4>
              <p className="text-slate-600 text-sm">
                Get immediate assessments and personalized recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h4 className="font-bold text-slate-900 mb-2">Actionable</h4>
              <p className="text-slate-600 text-sm">
                Receive clinical advice and prevention strategies
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Take Control of Your Health Today
          </h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Understanding your health risks is the first step toward prevention and 
            better health outcomes. Our AI-powered system gives you personalized insights 
            backed by science.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/diabetes">
              <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition">
                Start Now
              </button>
            </Link>
          </div>
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
            💡 Disclaimer: This system provides risk assessments and is not a medical diagnosis. 
            Always consult with healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
