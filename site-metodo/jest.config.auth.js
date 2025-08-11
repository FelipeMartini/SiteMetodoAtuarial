module.exports = {
  testEnvironment: 'node', // Ambiente Node puro para suportar crypto.subtle
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/@core/$1',
  },
  testMatch: ['**/__tests__/auth/**/*.[jt]s?(x)', '**/__tests__/auth/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!next-auth)/', '/.next/'],
  testTimeout: 10000,
  maxWorkers: 1,
  forceExit: true,
}
