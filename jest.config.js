export default {
  testEnvironment: 'jsdom',
  transform: {},
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/jest.config.js'],
  setupFiles: ['./jest.setup.js'],
};
