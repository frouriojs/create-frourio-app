import type { Config } from 'jest'

const config: Config = {
  setupFiles: ['<rootDir>/test/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest'
  },
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js'
  }
}

export default config
