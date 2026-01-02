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

export default function DiabetesForm({ form, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Type 2 Diabetes Risk Assessment
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Age (years)"
          name="age"
          value={form.age}
          onChange={onChange}
        />
        <Input label="BMI" name="bmi" value={form.bmi} onChange={onChange} />

        <Select
          label="High Blood Pressure"
          name="highbp"
          value={form.highbp}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Select
          label="High Cholesterol"
          name="highchol"
          value={form.highchol}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Select
          label="General Health"
          name="genhlth"
          value={form.genhlth}
          onChange={onChange}
          options={[
            { label: "Excellent", value: "1" },
            { label: "Very Good", value: "2" },
            { label: "Good", value: "3" },
            { label: "Fair", value: "4" },
            { label: "Poor", value: "5" },
          ]}
        />

        <Select
          label="Difficulty Walking/Stairs"
          name="diffwalk"
          value={form.diffwalk}
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
