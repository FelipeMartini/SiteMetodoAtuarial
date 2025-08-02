module.exports = {
  // Configuração do ambiente de testes para React/Next.js
  testEnvironment: "jest-environment-jsdom", // Simula o DOM para testes de componentes React
  setupFilesAfterEnv: ["@testing-library/jest-dom"], // Extensões do Testing Library para asserções
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Evita erro ao importar estilos
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // Ignora pastas desnecessárias
  // Utiliza o SWC como transformador para arquivos TypeScript/JSX, compatível com Next.js moderno
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },
};
