export default function SelectInput({ label, options, value, onChange }) {
  return (
    <label className="block text-sm mb-3">
      <span className="mr-2">{label}:</span>
      <select
        className="border rounded px-2 py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(({ code, name }, idx) => (
          <option key={`${code}-${idx}`} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
