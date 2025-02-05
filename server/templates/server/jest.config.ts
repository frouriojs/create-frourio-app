import type { Config } from 'jest'

const config: Config = {
  setupFiles: ['<rootDir>/test/jest.setup.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  testMatch: ['<rootDir>/test/**/*.ts']
}

export default config
