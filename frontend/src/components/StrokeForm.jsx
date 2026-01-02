"use client";

const Input = ({ label, name, value, onChange, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm mb-1 text-slate-800 font-medium">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder={label}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm mb-1 text-slate-800 font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default function StrokeForm({ form, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Stroke Risk Assessment
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Age (years)"
          name="age"
          value={form.age}
          onChange={onChange}
        />

        <Select
          label="Hypertension"
          name="hypertension"
          value={form.hypertension}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Select
          label="Heart Disease"
          name="heart_disease"
          value={form.heart_disease}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Input
          label="Average Glucose Level (mg/dL)"
          name="avg_glucose_level"
          value={form.avg_glucose_level}
          onChange={onChange}
        />

        <Input
          label="BMI"
          name="bmi"
          value={form.bmi}
          onChange={onChange}
        />

        <Select
          label="Smoking Status"
          name="smoking_status"
          value={form.smoking_status}
          onChange={onChange}
          options={[
            { label: "Never Smoked", value: "0" },
            { label: "Formerly Smoked", value: "1" },
            { label: "Smokes", value: "2" },
          ]}
        />

        <Select
          label="Ever Married"
          name="ever_married"
          value={form.ever_married}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />
      </div>
    </div>
  );
}
