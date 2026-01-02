"use client";

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
  avg_glucose_level: "Avg Glucose",
  smoking_status: "Smoking Status",
  ever_married: "Ever Married",
};

export default function ShapExplanation({ explanation }) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <h3 className="text-sm font-semibold text-blue-900">
            Explainability Analysis (SHAP)
          </h3>
        </div>
        <p className="text-xs text-slate-500 bg-blue-50 px-3 py-1 rounded-full">
          Top contributing factors
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {explanation.map((item, idx) => {
          const impactColor =
            item.shap_value > 0 ? "text-red-600" : "text-green-600";
          const bgColor =
            item.shap_value > 0 ? "bg-red-50" : "bg-green-50";

          return (
            <div
              key={`${item.feature}-${idx}`}
              className={`${bgColor} border border-blue-100 rounded-lg p-4 transition-all hover:shadow-md`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {featureLabels[item.feature] || item.feature}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Value: {formatNum(item.value)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600 mb-1">SHAP Impact</p>
                  <p className={`font-mono font-bold ${impactColor}`}>
                    {formatNum(item.shap_value)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`${
                    item.shap_value > 0 ? "bg-red-500" : "bg-green-500"
                  } h-2 rounded-full`}
                  style={{
                    width: `${Math.min(Math.abs(item.shap_value) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
