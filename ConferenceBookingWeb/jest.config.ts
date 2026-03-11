import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Tells next/jest where to find next.config.mjs and .env files
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Handle the @/* path alias from tsconfig
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(config);
