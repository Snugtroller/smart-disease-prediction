"use client";

import { useState } from "react";
import { predictDisease } from "@/lib/api";
import RiskCard from "@/components/RiskCard";
import AdviceCard from "@/components/AdviceCard";
import ShapExplanation from "@/components/ShapExplanation";

export default function HypertensionPage() {
  const [form, setForm] = useState({
    age: "",
    sex: "1",
    trestbps: "",
    chol: "",
    fbs: "0",
    restecg: "0",
    exang: "0",
    slope: "1",
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
        disease: "hypertension",
        age: Number(form.age),
        sex: Number(form.sex),
        trestbps: Number(form.trestbps),
        chol: Number(form.chol),
        fbs: Number(form.fbs),
        restecg: Number(form.restecg),
        exang: Number(form.exang),
        slope: Number(form.slope),
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
      sex: "1",
      trestbps: "",
      chol: "",
      fbs: "0",
      restecg: "0",
      exang: "0",
      slope: "1",
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <span className="text-3xl">🏥</span>
            <div>
              <h1 className="text-xl font-bold">Smart Disease Prediction</h1>
              <p className="text-xs text-red-100">Prevention System</p>
            </div>
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl py-8">
        <div className="max-w-6xl mx-auto px-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium mb-4 w-fit"
          >
            ← Back to Home
          </a>
          <h1 className="text-4xl font-bold mb-2">❤️ Hypertension Risk Assessment</h1>
          <p className="text-red-100 text-lg">
            Assess your cardiovascular health and hypertension risk
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
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Sex</label>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                >
                  <option value="0">Female</option>
                  <option value="1">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Resting BP (mm Hg)</label>
                <input
                  type="number"
                  name="trestbps"
                  value={form.trestbps}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                  placeholder="e.g., 140"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  name="chol"
                  value={form.chol}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                  placeholder="e.g., 240"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Fasting Blood Sugar &gt; 120 mg/dL</label>
                <select
                  name="fbs"
                  value={form.fbs}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Resting ECG</label>
                <select
                  name="restecg"
                  value={form.restecg}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                >
                  <option value="0">Normal</option>
                  <option value="1">ST-T Abnormality</option>
                  <option value="2">LV Hypertrophy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Exercise-Induced Angina</label>
                <select
                  name="exang"
                  value={form.exang}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Slope of ST Segment</label>
                <select
                  name="slope"
                  value={form.slope}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition"
                >
                  <option value="0">Upsloping</option>
                  <option value="1">Flat</option>
                  <option value="2">Downsloping</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
