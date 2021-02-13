import { pathsToModuleNameMapper } from 'ts-jest/utils'
import type { Config } from '@jest/types'
import { compilerOptions } from './tsconfig.json'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['jest-expect-message'],
  testPathIgnorePatterns: ['/templates/', '/.tmp/'],
  modulePathIgnorePatterns: ['/templates/', '/.tmp/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
}

export default config
