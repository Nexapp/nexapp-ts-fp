module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-node',
  testMatch: null,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testRunner: 'jest-circus/runner',
  transform: {
    "^.+\\.tsx?$": "esbuild-jest"
  },
  verbose: true,
};
