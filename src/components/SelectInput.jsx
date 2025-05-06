export default function SelectInput({ label, options, value, onChange }) {
  // Genera un ID único para la asociación label-select (importante para accesibilidad)
  const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    // Usar htmlFor para conectar label y select
    <label htmlFor={selectId} className="block text-sm mb-1 font-medium text-gray-700">
      {' '}
      {/* Ajustado estilo label */}
      {label}:
      <select
        id={selectId} // Asociar con el label
        // Añadido: Estilos de focus
        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Clases de Tailwind para mejor apariencia y focus
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {/* Renderiza una opción deshabilitada si no hay valor seleccionado (aunque el useEffect debería prevenir esto) */}
        {value === '' && (
          <option value="" disabled>
            Selecciona...
          </option>
        )}
        {options.map(({ code, name }) => (
          // Usar code como key si es único, si no, combinar
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
