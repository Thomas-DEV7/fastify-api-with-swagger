/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // Local onde os testes são buscados
    modulePaths: ['<rootDir>/src'],      // Base para importações
  };
  