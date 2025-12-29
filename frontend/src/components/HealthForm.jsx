"use client";

import { useState } from "react";
import { predictDisease } from "../lib/api";

/* =========================
   INITIAL STATES
========================= */

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

/* =========================
   COMPONENT
========================= */

export default function HealthForm() {
  const [form, setForm] = useState(diabetesInitial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const formatNum = (value) =>
    value === undefined || value === null || Number.isNaN(Number(value))
      ? "-"
      : Number(value).toFixed(3);

  const featureLabels = {
    age: "Age",
    sex: "Sex",
    bmi: "BMI",
    highbp: "High Blood Pressure",
    highchol: "High Cholesterol",
    genhlth: "General Health",
    diffwalk: "Difficulty Walking",
    trestbps: "Resting BP",
    chol: "Cholesterol",
    fbs: "Fasting Blood Sugar",
    restecg: "Resting ECG",
    exang: "Exercise Angina",
    slope: "ST Slope",
    hypertension: "Hypertension",
    heart_disease: "Heart Disease",
    avg_glucose_level: "Avg Glucose Level",
    smoking_status: "Smoking Status",
    ever_married: "Ever Married",
  };

  /* =========================
     HANDLERS
  ========================= */

  const handleDiseaseChange = (e) => {
    const disease = e.target.value;
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
        // stroke
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
      setError("Prediction failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    let initialState;
    if (form.disease === "diabetes") {
      initialState = diabetesInitial;
    } else if (form.disease === "hypertension") {
      initialState = hypertensionInitial;
    } else if (form.disease === "stroke") {
      initialState = strokeInitial;
    }
    setForm(initialState);
    setResult(null);
    setError("");
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 border text-slate-900">

      <h2 className="text-3xl font-bold mb-2 text-slate-900">
        🏥 AI-Based Disease Risk Assessment
      </h2>
      <p className="text-slate-700 mb-6">
        Enter your health parameters for explainable AI prediction
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Disease Selector */}
        <Select
          label="Select Disease"
          name="disease"
          value={form.disease}
          onChange={handleDiseaseChange}
          options={[
            { label: "Type 2 Diabetes", value: "diabetes" },
            { label: "Hypertension", value: "hypertension" },
            { label: "Stroke Risk", value: "stroke" },
          ]}
        />

        {/* =========================
           DIABETES (BRFSS)
        ========================= */}
        {form.disease === "diabetes" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Age (years)" name="age" value={form.age} onChange={handleChange} />
            <Input label="BMI" name="bmi" value={form.bmi} onChange={handleChange} />
            
            <Select label="High Blood Pressure" name="highbp" value={form.highbp} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />
            
            <Select label="High Cholesterol" name="highchol" value={form.highchol} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />
            
            <Select label="General Health" name="genhlth" value={form.genhlth} onChange={handleChange}
              options={[
                { label: "Excellent", value: "1" },
                { label: "Very Good", value: "2" },
                { label: "Good", value: "3" },
                { label: "Fair", value: "4" },
                { label: "Poor", value: "5" },
              ]}
            />
            
            <Select label="Difficulty Walking/Stairs" name="diffwalk" value={form.diffwalk} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />
          </div>
        )}

        {/* =========================
           HYPERTENSION (BRFSS)
        ========================= */}
        {form.disease === "hypertension" && (
          <div className="grid md:grid-cols-2 gap-4">

            <Input label="Age (years)" name="age" value={form.age} onChange={handleChange} />
            <Select label="Sex" name="sex" value={form.sex} onChange={handleChange}
              options={[
                { label: "Female", value: "0" },
                { label: "Male", value: "1" },
              ]}
            />

            <Input label="Resting BP (mm Hg)" name="trestbps" value={form.trestbps} onChange={handleChange} />
            <Input label="Cholesterol (mg/dL)" name="chol" value={form.chol} onChange={handleChange} />

            <Select label="Fasting Blood Sugar > 120 mg/dL" name="fbs" value={form.fbs} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />

            <Select label="Resting ECG" name="restecg" value={form.restecg} onChange={handleChange}
              options={[
                { label: "Normal", value: "0" },
                { label: "ST-T Abnormality", value: "1" },
                { label: "LV Hypertrophy", value: "2" },
              ]}
            />

            <Select label="Exercise-Induced Angina" name="exang" value={form.exang} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />

            <Select label="Slope of ST Segment" name="slope" value={form.slope} onChange={handleChange}
              options={[
                { label: "Upsloping", value: "0" },
                { label: "Flat", value: "1" },
                { label: "Downsloping", value: "2" },
              ]}
            />
          </div>
        )}

        {/* =========================
           STROKE
        ========================= */}
        {form.disease === "stroke" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Age (years)" name="age" value={form.age} onChange={handleChange} />
            
            <Select label="Hypertension" name="hypertension" value={form.hypertension} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />
            
            <Select label="Heart Disease" name="heart_disease" value={form.heart_disease} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />
            
            <Input label="Average Glucose Level (mg/dL)" name="avg_glucose_level" value={form.avg_glucose_level} onChange={handleChange} />
            
            <Input label="BMI" name="bmi" value={form.bmi} onChange={handleChange} />
            
            <Select label="Smoking Status" name="smoking_status" value={form.smoking_status} onChange={handleChange}
              options={[
                { label: "Never Smoked", value: "0" },
                { label: "Formerly Smoked", value: "1" },
                { label: "Smokes", value: "2" },
              ]}
            />
            
            <Select label="Ever Married" name="ever_married" value={form.ever_married} onChange={handleChange}
              options={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            {loading ? "Analyzing..." : "🔍 Predict Risk"}
          </button>

          <button type="button" onClick={handleReset}
            className="px-6 py-3 bg-gray-100 rounded-xl">
            Reset
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 bg-blue-50 p-6 rounded-2xl border">
          <div className="grid md:grid-cols-3 text-center gap-4">
            <div>
              <p className="text-sm text-slate-600">Disease</p>
              <p className="font-bold text-lg">{result.disease_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Risk</p>
              <p className="text-2xl font-bold">{(result.risk_score * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Level</p>
              <p className={`font-bold ${
                result.risk_label === "High" ? "text-red-600" :
                result.risk_label === "Moderate" ? "text-yellow-600" :
                "text-green-600"
              }`}>
                {result.risk_label}
              </p>
            </div>
          </div>

          {/* Advice */}
          {result.advice && (
            <div className="mt-4 bg-white border border-blue-100 rounded-xl p-4 text-slate-800">
              <p className="text-sm font-semibold text-blue-700 mb-1">Clinical-style advice</p>
              <p className="leading-relaxed">{result.advice}</p>
            </div>
          )}

          {/* SHAP / Explainability */}
          {Array.isArray(result.explanation) && result.explanation.length > 0 && (
            <div className="mt-4 bg-white border border-blue-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-700">Explainability (SHAP)</p>
                <p className="text-xs text-slate-500">Top contributing features</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {result.explanation.map((item, idx) => (
                  <div key={`${item.feature}-${idx}`} className="flex justify-between items-center bg-blue-50/60 border border-blue-100 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{featureLabels[item.feature] || item.feature}</p>
                      <p className="text-xs text-slate-500">Value: {formatNum(item.value)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">SHAP</p>
                      <p className="font-mono text-sm text-blue-700">{formatNum(item.shap_value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

/* =========================
   REUSABLE INPUTS
========================= */

const Input = ({ label, name, value, onChange, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm mb-1 text-slate-800">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border rounded-xl px-4 py-2 text-slate-900"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm mb-1 text-slate-800">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl px-4 py-2 text-slate-900"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);
