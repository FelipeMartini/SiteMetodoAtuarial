module.exports = {
  // Configuração do ambiente de testes para React/Next.js
  testEnvironment: "jest-environment-jsdom", // Simula o DOM para testes de componentes React
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./jest.setup.js"], // Extensões do Testing Library + polyfill fetch
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Evita erro ao importar estilos
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // Ignora pastas desnecessárias
  // Utiliza Babel apenas para os testes, apontando para o arquivo babel-jest.config.js
  transform: {
    "^.+\\.(t|j)sx?$": ["babel-jest", { configFile: "./babel-jest.config.js" }]
  },
};
