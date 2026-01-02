"use client";

export default function RiskCard({ disease, riskScore, riskLabel }) {
  const getRiskColor = (label) => {
    switch (label) {
      case "High":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
      case "Moderate":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
      case "Low":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
        };
    }
  };

  const colors = getRiskColor(riskLabel);

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 mb-6`}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-1 font-medium">Disease</p>
          <p className="text-xl font-bold text-slate-900">{disease}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-1 font-medium">Risk Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {(riskScore * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-1 font-medium">Risk Level</p>
          <p className={`text-xl font-bold ${colors.text}`}>{riskLabel}</p>
        </div>
      </div>
    </div>
  );
}
