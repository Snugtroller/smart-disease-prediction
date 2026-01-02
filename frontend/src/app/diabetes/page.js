"use client";

import { useState } from "react";
import { predictDisease } from "@/lib/api";
import RiskCard from "@/components/RiskCard";
import AdviceCard from "@/components/AdviceCard";
import ShapExplanation from "@/components/ShapExplanation";

export default function DiabetesPage() {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    highbp: "0",
    highchol: "0",
    genhlth: "1",
    diffwalk: "0",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        disease: "diabetes",
        age: Number(form.age),
        bmi: Number(form.bmi),
        highbp: Number(form.highbp),
        highchol: Number(form.highchol),
        genhlth: Number(form.genhlth),
        diffwalk: Number(form.diffwalk),
      };

      const data = await predictDisease(payload);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      age: "",
      bmi: "",
      highbp: "0",
      highchol: "0",
      genhlth: "1",
      diffwalk: "0",
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <span className="text-3xl">🏥</span>
            <div>
              <h1 className="text-xl font-bold">Smart Disease Prediction</h1>
              <p className="text-xs text-blue-100">Prevention System</p>
            </div>
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl py-8">
        <div className="max-w-6xl mx-auto px-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium mb-4 w-fit"
          >
            ← Back to Home
          </a>
          <h1 className="text-4xl font-bold mb-2">🩺 Type 2 Diabetes Risk Assessment</h1>
          <p className="text-blue-100 text-lg">
            Assess your risk for Type 2 Diabetes using our advanced AI model
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">BMI</label>
                <input
                  type="number"
                  name="bmi"
                  value={form.bmi}
                  onChange={handleChange}
                  required
                  step="0.1"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your BMI"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">High Blood Pressure</label>
                <select
                  name="highbp"
                  value={form.highbp}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">High Cholesterol</label>
                <select
                  name="highchol"
                  value={form.highchol}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">General Health</label>
                <select
                  name="genhlth"
                  value={form.genhlth}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="1">Excellent</option>
                  <option value="2">Very Good</option>
                  <option value="3">Good</option>
                  <option value="4">Fair</option>
                  <option value="5">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Difficulty Walking/Stairs</label>
                <select
                  name="diffwalk"
                  value={form.diffwalk}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⚙️</span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Predict Risk
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex gap-3">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Assessment Results</h2>

              <RiskCard
                disease={result.disease_name}
                riskScore={result.risk_score}
                riskLabel={result.risk_label}
              />

              {result.advice && <AdviceCard advice={result.advice} />}

              {Array.isArray(result.explanation) && result.explanation.length > 0 && (
                <ShapExplanation explanation={result.explanation} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-semibold mb-2">Smart Disease Prediction and Prevention System</p>
          <p className="text-sm text-slate-500">
            © 2025 | Advanced Health Risk Assessment with Explainable AI (SHAP)
          </p>
        </div>
      </footer>
    </div>
  );
}
