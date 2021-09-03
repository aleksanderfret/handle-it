import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!src/__tests__/*.*'],
  coverageDirectory: 'coverage',
  displayName: 'browser',
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/__tests__'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.ts',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  name: 'browser',
  setupFilesAfterEnv: [
    // '@testing-library/react/cleanup-after-each',
    // '@testing-library/jest-dom/extend-expect'
    '<rootDir>/src/__tests__/setupTests.ts'
  ],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js|jsx)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
export default config;
