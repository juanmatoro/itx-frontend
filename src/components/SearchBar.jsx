export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Buscar por marca o modelo…"
      className="w-full md:w-96 border rounded px-3 py-2 mb-6"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
