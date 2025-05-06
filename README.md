# ITX Frontend Test - Mini E-commerce

Este proyecto es una solución para la prueba técnica de Front-End de ITX, consistente en una pequeña aplicación de comercio electrónico para visualizar y comprar dispositivos móviles.

La aplicación permite ver un listado de productos, filtrar por marca o modelo, ver los detalles de un producto específico, seleccionar opciones (color, almacenamiento) y añadir productos a un carrito de compra virtual.

## Tecnologías Utilizadas

- **Framework:** React (v19)
- **Bundler:** Vite
- **Estilos:** Tailwind CSS
- **Routing:** React Router DOM (v7)
- **Estado Global:** React Context API
- **Testing:** Jest + React Testing Library
- **Linting/Formatting:** ESLint + Prettier
- **Hooks Git:** Husky + lint-staged

## Requisitos Previos

- Node.js (Se recomienda v18 o superior)
- npm (v8+) o yarn

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <url-del-repositorio>
    cd itx-frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    # o si usas yarn:
    # yarn install
    ```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- ### `npm run dev` (o `yarn dev`)

  Ejecuta la aplicación en modo desarrollo.<br />
  Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite) para verla en tu navegador. La página se recargará si haces cambios.

- ### `npm test` (o `yarn test`)

  Lanza el corredor de tests (Jest) en modo interactivo.

- ### `npm run lint` (o `yarn lint`)

  Ejecuta ESLint para revisar el código en busca de problemas de estilo o errores potenciales.

- ### `npm run build` (o `yarn build`)
  Compila la aplicación para producción en la carpeta `dist/`.<br />
  Optimiza la build para el mejor rendimiento.

## Notas Adicionales

- **API:** La aplicación consume datos de una API proporcionada para la prueba (`https://itx-frontend-test.onrender.com/`).
- **Cache:** Se implementa un sistema de caché en el lado del cliente usando `localStorage` para las peticiones GET de productos y detalles de producto. La caché tiene una duración de 1 hora para evitar peticiones repetitivas.
- **Carrito:** El estado del carrito (ítems añadidos) también se persiste en `localStorage` para que no se pierda al recargar la página.
