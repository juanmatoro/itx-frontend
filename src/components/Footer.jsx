import React from 'react';

// Datos de ejemplo para los enlaces (puedes reemplazarlos o dejarlos como placeholders)
const footerLinks = {
  about: [
    { name: '¿Quiénes somos?', href: '#' },
    { name: 'Prensa', href: '#' },
    { name: 'Nuestro impacto', href: '#' },
    { name: '¡Estamos contratando!', href: '#' },
    { name: 'Trustpilot', href: '#' },
    // Añadir iconos sociales aquí si se desea
  ],
  help: [
    { name: 'Contacto', href: '#' },
    { name: 'Centro de ayuda', href: '#' },
    { name: 'Entrega', href: '#' },
    { name: 'Devoluciones y reembolsos', href: '#' },
  ],
  services: [
    { name: 'Garantía comercial', href: '#' },
    { name: 'Seguros', href: '#' },
    { name: 'ReNew', href: '#' },
    { name: 'Descuento estudiantes', href: '#' },
    { name: 'Profesionales: ¿cómo vender aquí?', href: '#' },
    { name: 'Portal del vendedor', href: '#' },
    { name: 'Back Office', href: '#' },
    { name: 'Pago 100% seguro', href: '#' },
    // Añadir iconos de pago aquí si se desea
  ],
  guides: [
    { name: 'Tecnoteca', href: '#' },
    { name: 'Comparar productos', href: '#' },
    { name: 'Ideas de regalos', href: '#' },
  ],
  legal: [
    { name: 'Condiciones generales de uso', href: '#' },
    { name: 'Condiciones generales de venta', href: '#' },
    { name: 'Términos y Condiciones de ReNew', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'Protección de datos', href: '#' },
    { name: 'Otra información legal', href: '#' },
    { name: 'Aviso Legal', href: '#' },
    { name: 'Reportar contenido ilícito', href: '#' },
  ],
};

export default function Footer() {
  // Obten el año actual dinámicamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      {' '}
      {/* Fondo blanco y borde superior */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Grid principal para las columnas de enlaces */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
          {/* Columna Sobre Nosotros */}
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-3">Sobre ITX Store</h5>
            <ul className="space-y-2">
              {footerLinks.about.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-gray-600 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              {/* Placeholder para iconos sociales */}
              <li className="flex space-x-3 pt-2">
                <span className="text-xs text-gray-400">(Iconos Sociales)</span>
                {/* Ejemplo: <a href="#"><IconoTwitter /></a> */}
              </li>
            </ul>
          </div>

          {/* Columna Ayuda */}
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-3">Ayuda</h5>
            <ul className="space-y-2">
              {footerLinks.help.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-gray-600 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Servicios */}
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-3">Servicios</h5>
            <ul className="space-y-2">
              {footerLinks.services.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-gray-600 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              {/* Placeholder para iconos de pago */}
              <li className="flex space-x-1 pt-2">
                <span className="text-xs text-gray-400">(Iconos Pago)</span>
              </li>
            </ul>
          </div>

          {/* Columna Guías de compra */}
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-3">Guías de compra</h5>
            <ul className="space-y-2">
              {footerLinks.guides.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-gray-600 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Condiciones legales */}
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-3">Condiciones legales</h5>
            <ul className="space-y-2">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-gray-600 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Certificado (Placeholder) */}
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-3">ITX Store</h5>
            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded">
              <img src="/logo2.svg" alt="Certificado ITX Store" className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />

        {/* Sección inferior: Copyright y Tiendas */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <span className="text-xs text-gray-500">
            &copy; {currentYear} ITX Store. Todos los derechos reservados.
          </span>
          <div className="flex justify-center space-x-4 mt-4 sm:mt-0">
            {/* Placeholders para los logos de las tiendas */}
            <a
              href="#"
              className="text-xs text-gray-500 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
            >
              Google Play
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
            >
              App Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
