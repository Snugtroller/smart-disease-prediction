"use client";

export default function AdviceCard({ advice }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex gap-3">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Clinical Recommendations
          </h3>
          <p className="text-slate-800 leading-relaxed text-sm">{advice}</p>
        </div>
      </div>
    </div>
  );
}
