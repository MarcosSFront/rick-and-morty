module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: ['html', 'text-summary'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  reporters: ['default'],
};
