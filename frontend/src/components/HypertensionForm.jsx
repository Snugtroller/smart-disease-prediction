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

export default function HypertensionForm({ form, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Hypertension Risk Assessment
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Age (years)"
          name="age"
          value={form.age}
          onChange={onChange}
        />
        <Select
          label="Sex"
          name="sex"
          value={form.sex}
          onChange={onChange}
          options={[
            { label: "Female", value: "0" },
            { label: "Male", value: "1" },
          ]}
        />

        <Input
          label="Resting BP (mm Hg)"
          name="trestbps"
          value={form.trestbps}
          onChange={onChange}
        />
        <Input
          label="Cholesterol (mg/dL)"
          name="chol"
          value={form.chol}
          onChange={onChange}
        />

        <Select
          label="Fasting Blood Sugar > 120 mg/dL"
          name="fbs"
          value={form.fbs}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Select
          label="Resting ECG"
          name="restecg"
          value={form.restecg}
          onChange={onChange}
          options={[
            { label: "Normal", value: "0" },
            { label: "ST-T Abnormality", value: "1" },
            { label: "LV Hypertrophy", value: "2" },
          ]}
        />

        <Select
          label="Exercise-Induced Angina"
          name="exang"
          value={form.exang}
          onChange={onChange}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Select
          label="Slope of ST Segment"
          name="slope"
          value={form.slope}
          onChange={onChange}
          options={[
            { label: "Upsloping", value: "0" },
            { label: "Flat", value: "1" },
            { label: "Downsloping", value: "2" },
          ]}
        />
      </div>
    </div>
  );
}
