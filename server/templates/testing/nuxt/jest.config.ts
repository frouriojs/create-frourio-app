import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { compilerOptions } from './tsconfig.json'

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      testPathIgnorePatterns: ['<rootDir>/server'],
      moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: '<rootDir>/'
        }),
        '^vue$': 'vue/dist/vue.common.js'
      },
      moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
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
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/'
      })
    }
  ]
}

export default config
