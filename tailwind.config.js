/** @type {import('tailwindcss').Config} */
export default {
  // Archivos que Tailwind debe escanear para purgar clases no usadas
  content: [
    './index.html',
    './src/**/*.{js,jsx}', // añade ts/tsx si algún día usas TS
  ],
  theme: {
    extend: {}, // aquí podrás sobrescribir colores, fuentes, etc.
  },
  plugins: [], // por ahora sin plugins extra
};
