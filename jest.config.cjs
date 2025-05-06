// jest.config.js  (en la raíz, CommonJS puro)
module.exports = {
  testEnvironment: 'jsdom',

  // se evalúan antes de cargar react, react‑router, etc.
  setupFiles: ['<rootDir>/jest.polyfill.cjs'],

  // helpers de Testing‑Library, fetch, etc. (después)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
