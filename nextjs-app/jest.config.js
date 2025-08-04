module.exports = {
  // Configuração do ambiente de testes para React/Next.js
  testEnvironment: "jest-environment-jsdom", // Simula o DOM para testes de componentes React
  setupFilesAfterEnv: ["./jest.setup.js"], // Carrega o ambiente customizado
  moduleNameMapper: {
    // Mapeia imports de estilos para evitar erro
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mapeia o alias @/ para o diretório raiz do app, conforme tsconfig.json
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // Ignora pastas desnecessárias
  transform: {
    "^.+\\.(t|j)sx?$": ["babel-jest", { configFile: "./babel-jest.config.js" }]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!next-auth)/",
    "/.next/"
  ],
  testTimeout: 10000, // Timeout de 10 segundos por teste
  maxWorkers: 1, // Usa apenas 1 worker para evitar conflitos
  forceExit: true, // Força saída após testes
};
