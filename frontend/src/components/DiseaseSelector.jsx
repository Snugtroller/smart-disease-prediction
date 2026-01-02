"use client";

export default function DiseaseSelector({ disease, onDiseaseChange, options }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-800 mb-3">
        Select Disease
      </label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onDiseaseChange(option.value)}
            className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
              disease === option.value
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {option.icon} {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
