"use client";

import { useState } from "react";
import { predictDisease } from "../lib/api";
import DiseaseSelector from "./DiseaseSelector";
import DiabetesForm from "./DiabetesForm";
import HypertensionForm from "./HypertensionForm";
import StrokeForm from "./StrokeForm";
import RiskCard from "./RiskCard";
import AdviceCard from "./AdviceCard";
import ShapExplanation from "./ShapExplanation";

/* Initial States */
const diabetesInitial = {
  disease: "diabetes",
  age: "",
  bmi: "",
  highbp: "0",
  highchol: "0",
  genhlth: "1",
  diffwalk: "0",
};

const hypertensionInitial = {
  disease: "hypertension",
  age: "",
  sex: "1",
  trestbps: "",
  chol: "",
  fbs: "0",
  restecg: "0",
  exang: "0",
  slope: "1",
};

const strokeInitial = {
  disease: "stroke",
  age: "",
  hypertension: "0",
  heart_disease: "0",
  avg_glucose_level: "",
  bmi: "",
  smoking_status: "0",
  ever_married: "0",
};

const diseaseOptions = [
  { label: "Diabetes", value: "diabetes", icon: "🩺" },
  { label: "Hypertension", value: "hypertension", icon: "❤️" },
  { label: "Stroke", value: "stroke", icon: "🧠" },
];

export default function HealthForm() {
  const [form, setForm] = useState(diabetesInitial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDiseaseChange = (disease) => {
    let initialState;
    if (disease === "diabetes") {
      initialState = diabetesInitial;
    } else if (disease === "hypertension") {
      initialState = hypertensionInitial;
    } else if (disease === "stroke") {
      initialState = strokeInitial;
    }
    setForm(initialState);
    setResult(null);
    setError("");
  };

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
      let payload;

      if (form.disease === "diabetes") {
        payload = {
          disease: "diabetes",
          age: Number(form.age),
          bmi: Number(form.bmi),
          highbp: Number(form.highbp),
          highchol: Number(form.highchol),
          genhlth: Number(form.genhlth),
          diffwalk: Number(form.diffwalk),
        };
      } else if (form.disease === "hypertension") {
        payload = {
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
      } else {
        payload = {
          disease: "stroke",
          age: Number(form.age),
          hypertension: Number(form.hypertension),
          heart_disease: Number(form.heart_disease),
          avg_glucose_level: Number(form.avg_glucose_level),
          bmi: Number(form.bmi),
          smoking_status: Number(form.smoking_status),
          ever_married: Number(form.ever_married),
        };
      }

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
    handleDiseaseChange(form.disease);
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Disease Risk Assessment
          </h1>
          <p className="text-slate-600 text-lg">
            Get personalized health insights powered by machine learning and
            explainable AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Disease Selector */}
            <DiseaseSelector
              disease={form.disease}
              onDiseaseChange={handleDiseaseChange}
              options={diseaseOptions}
            />

            {/* Disease-Specific Forms */}
            {form.disease === "diabetes" && (
              <DiabetesForm form={form} onChange={handleChange} />
            )}
            {form.disease === "hypertension" && (
              <HypertensionForm form={form} onChange={handleChange} />
            )}
            {form.disease === "stroke" && (
              <StrokeForm form={form} onChange={handleChange} />
            )}

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

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex gap-3">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Assessment Results
                </h2>

                {/* Risk Card */}
                <RiskCard
                  disease={result.disease_name}
                  riskScore={result.risk_score}
                  riskLabel={result.risk_label}
                />

                {/* Advice Card */}
                {result.advice && (
                  <AdviceCard advice={result.advice} />
                )}

                {/* SHAP Explanation */}
                {Array.isArray(result.explanation) &&
                  result.explanation.length > 0 && (
                    <ShapExplanation explanation={result.explanation} />
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
