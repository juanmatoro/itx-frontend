export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Buscar por marca o modelo…"
      className="w-full md:w-80 border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Clases mejoradas, quitado mb-6 (se maneja en PLP)
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Buscar productos"
    />
  );
}
