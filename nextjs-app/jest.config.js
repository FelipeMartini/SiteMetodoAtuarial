module.exports = {
  // Configuração do ambiente de testes para React/Next.js
  testEnvironment: "jest-environment-jsdom", // Simula o DOM para testes de componentes React
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./jest.setup.js"], // Extensões do Testing Library + polyfill fetch
  moduleNameMapper: {
    // Mapeia imports de estilos para evitar erro
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mapeia o alias @/ para o diretório raiz do app, conforme tsconfig.json
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // Ignora pastas desnecessárias
  // Utiliza Babel apenas para os testes, apontando para o arquivo babel-jest.config.js
  transform: {
    "^.+\\.(t|j)sx?$": ["babel-jest", { configFile: "./babel-jest.config.js" }]
  },
  // Permite que Babel processe o pacote next-auth (ESM)
  transformIgnorePatterns: [
    "/node_modules/(?!next-auth)/",
    "/.next/"
  ],
};
