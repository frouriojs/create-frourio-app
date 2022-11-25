import { pathsToModuleNameMapper } from 'ts-jest'
import type { Config } from '@jest/types'
import { compilerOptions } from './tsconfig.json'

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      <% if (aspida === 'fetch') { %>setupFiles: ['<rootDir>/test/jest.setup.js'],
      <% } %>testPathIgnorePatterns: ['<rootDir>/server'],
      testEnvironment: 'jest-environment-jsdom',
      transform: {
        '^.+\\.tsx$': 'babel-jest',
        '^.+\\.ts$': 'ts-jest'
      },
      moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: '<rootDir>/'
        })
      }
    },
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/test/**/*.ts'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/'
      })
    }
  ]
}

export default config
