import { pathsToModuleNameMapper } from 'ts-jest'
import type { Config } from '@jest/types'
import { compilerOptions } from './tsconfig.json'

const config: Config.InitialOptions = {
  detectOpenHandles: true,
  forceExit: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['jest-expect-message'],
  testPathIgnorePatterns: ['/templates/'],
  modulePathIgnorePatterns: ['/templates/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
}

export default config
