import { pathsToModuleNameMapper } from 'ts-jest'
import type { Config } from '@jest/types'
import { compilerOptions } from './tsconfig.json'
import { compilerOptions as serverCompilerOptions } from './server/tsconfig.json'

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      <% if (aspida === 'fetch') { %>setupFiles: ['<rootDir>/test/jest.setup.js'],
      <% } %>testPathIgnorePatterns: ['<rootDir>/server'],
      moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: '<rootDir>/'
        }),
        '^vue$': 'vue/dist/vue.common.js'
      },
      moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest'
      },
      collectCoverageFrom: [
        '<rootDir>/components/**/*.vue',
        '<rootDir>/pages/**/*.vue'
      ]
    },
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/test/**/*.ts'],
      moduleNameMapper: pathsToModuleNameMapper(serverCompilerOptions.paths, {
        prefix: '<rootDir>/server/'
      })
    }
  ]
}

export default config
